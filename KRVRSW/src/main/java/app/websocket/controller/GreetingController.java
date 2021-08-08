package app.websocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import app.websocket.model.Greeting;
import app.websocket.model.HelloMessage;

@Controller
public class GreetingController {


    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Greeting greeting(HelloMessage message) throws Exception {
        System.out.println("Connected");
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

}