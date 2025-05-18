const buf = [];
export const postMessage = (e) => {
//    console.log("postmes", o)
        if (e.type == "t") {
            // handle term event
//            write_to_term(oEvent.data.d);
            //term.write(String.fromCharCode(e.d));
            //term.write(String.fromCharCode(e.d));
            const c = String.fromCharCode(e.d);
            if (c == "\n") {
              console.log(buf.join(""));
              buf.length = 0;
            } else {
              buf.push(c);
            }
        }
            /*
        } else if (oEvent.data.type == "p") {
            // handle prog bar event
            document.getElementById("bar").style.width = (oEvent.data.d*100).toString() + "%";
        } else if (oEvent.data.type == "tr") {
            // handle terminal read
        } else if (oEvent.data.type == "m") {
            // update MIPS counter
            document.getElementById('kernelDown').innerHTML = "Millions of Instructions Per Second";
            $("#kernelDown").hide();
            $("#progbar").hide();
            $('#mipsLabel').show();
            $("#mipsCount").show();
            document.getElementById("mipsCount").innerHTML = oEvent.data.d;
        }
        */
}
