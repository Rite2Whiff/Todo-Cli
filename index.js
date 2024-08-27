const { Command } = require("commander");
const fs = require("fs");

const program = new Command();
const path = "todos.json";

program
  .name("todo-cli")
  .description("help users create a todo list")
  .version("0.8.0");

program
  .command("add")
  .description("add a todo")
  .argument("<string...>", "add todo to a list")
  .action((string) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err && err.code === "ENOENT") {
        data = "[]";
      } else if (err) {
        console.log("err", err);
        return;
      }

      let jsonArray = JSON.parse(data);
      const newObj = {
        id: jsonArray.length + 1,
        description: string.join(" "),
      };
      jsonArray.push(newObj);
      fs.writeFile(path, JSON.stringify(jsonArray, null, 2), (err) => {
        if (err) {
          console.log("err", err);
        } else {
          console.log("todo added successfully");
        }
      });
    });
  });

program
  .command("list")
  .description("show the current Todo list")
  .action(() => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.log("err", err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.map((item) => {
          console.log(item.description);
        });
      }
    });
  });

program
  .command("mark")
  .description("mark a todo as completed")
  .argument("<id>", "id")
  .action((id) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.log("err", err);
      } else {
        let parsedData = JSON.parse(data);
        const currItem = parsedData.find((item) => item.id == id);
        currItem.description += " [status:completed]";
        fs.writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
          if (err) {
            console.log("err", err);
          } else {
            console.log("todo marked successfully");
          }
        });
      }
    });
  });

program
  .command("delete")
  .description("delete a todo")
  .argument("<id>", "delete a todo")
  .action((id) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.log("err", err);
      } else {
        let parsedData = JSON.parse(data);
        const newParsedData = parsedData.filter((item) => item.id != id);
        fs.writeFile(path, JSON.stringify(newParsedData, null, 2), (err) => {
          if (err) {
            console.log("err", err);
          } else {
            console.log("todo deleted successfully");
          }
        });
      }
    });
  });

program.parse();
