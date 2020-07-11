import * as Plugin from "iitcpluginkit";


class <classname> implements Plugin.Class {

    init() {
        console.log("<classname> " + VERSION);

        <css>require("./styles.css"); </css>

        // FILL ME
    }

}


Plugin.Register(new <classname>(), "<classname>");
