import { useContext } from "react";
import { FileContext } from "@context/file";

export default function FileInfo() {
  const { getSelectedFile } = useContext(FileContext);
  const selectedFile = getSelectedFile();

  const formatBytes = (bytes) => {
    if (bytes == 0) return "0 Bytes";
    var k = 1024,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        Name: {selectedFile ? selectedFile.name : ""}
      </li>
      <li class="list-group-item">
        Size: {formatBytes(selectedFile ? selectedFile.size : "")}
      </li>
    </ul>
  );
}
