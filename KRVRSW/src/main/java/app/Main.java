package app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import app.service.FilesStorageService;

import javax.annotation.Resource;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Collections;

@SpringBootApplication
@ServletComponentScan("app/servlet")
public class Main extends SpringBootServletInitializer implements CommandLineRunner {

    private static String host = "localhost";
    private static String port = "8080";

    @Autowired
    private ApplicationContext applicationContext;

    @Resource
    FilesStorageService storageService;

    public static void main(String[] args){
        System.setProperty("java.awt.headless", "false");
        SpringApplication app = new SpringApplication(Main.class);
        app.setDefaultProperties(Collections
                .singletonMap("server.port", port));
        app.run(args);
    }

    @Override
    public void run(String... arg) throws Exception {
        storageService.deleteAll();
        storageService.init();
    }

    @EventListener({ApplicationReadyEvent.class})
    void applicationReadyEvent() {
        System.out.println("Application started ... launching browser now: " + String.format("http://%s:%s", host, port));
        browse(String.format("http://%s:%s", host, port));

        TraySetup traySetup = new TraySetup();
        traySetup.setTray();
    }

    private static void browse(String url) {
        if(Desktop.isDesktopSupported()){
            Desktop desktop = Desktop.getDesktop();
            try {
                desktop.browse(new URI(url));
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
            }
        }else{
            Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec("rundll32 url.dll,FileProtocolHandler " + url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    private class TraySetup{
        //Obtain the image URL
        private Image createImage(String path, String description) {
            URL imageURL = Main.class.getClassLoader().getResource(path);

            if (imageURL == null) {
                System.err.println("Resource not found: " + path);
                return null;
            } else {
                return (new ImageIcon(imageURL, description)).getImage();
            }
        }

        public void setTray(){
            //Check the SystemTray is supported
            if (!SystemTray.isSupported()) {
                System.out.println("SystemTray is not supported");
                return;
            }
            final PopupMenu popup = new PopupMenu();
            Image image = createImage("assets/tray-1.jpg", "tray icon");
            int trayIconWidth = new TrayIcon(image).getSize().width;
            final TrayIcon trayIcon =
                    new TrayIcon(image.getScaledInstance(trayIconWidth, -1, Image.SCALE_SMOOTH));
            final SystemTray tray = SystemTray.getSystemTray();

            // Create a pop-up menu components
            MenuItem openItem = new MenuItem("Open");
            MenuItem aboutItem = new MenuItem("About");
            MenuItem exitItem = new MenuItem("Exit");

            openItem.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    browse(String.format("http://%s:%s", host, port));
                }
            });

            aboutItem.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    trayIcon.displayMessage("Sun TrayIcon Demo",
                            "This is an info message", TrayIcon.MessageType.INFO);
                }
            });

            exitItem.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    int exitCode = 2;
                    SpringApplication.exit(applicationContext, new ExitCodeGenerator() {
                        @Override
                        public int getExitCode() {
                            return exitCode;
                        }
                    });

                    System.exit(exitCode);
                }
            });

            //Add components to pop-up menu
            popup.add(openItem);
            popup.add(aboutItem);
            popup.addSeparator();
            popup.add(exitItem);

            trayIcon.setPopupMenu(popup);

            try {
                tray.add(trayIcon);
            } catch (AWTException e) {
                System.out.println("TrayIcon could not be added.");
            }
        }
    }
}
