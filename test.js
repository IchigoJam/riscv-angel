import { chainedFileLoader } from "./elfload.js";
import { CPU } from "./cpu.js";
//import { Long } from "./lib/closure-compiled/long.js";

// this code will run in a separate worker and interface with the run.html 
// page's DOM through message passing
/*
importScripts("lib/closure-compiled/long.js");
goog.require("goog.math.Long");

importScripts("lib/javascript-biginteger/biginteger.js");
Long = goog.math.Long;

importScripts("devices/character.js", "lib/binfile/binfile.js",
        "mappings.js", "utils.js", "mmu.js", "trap.js", "elfload.js", "inst_src.js",
        "cpu.js", "elfrun.js");
*/

//onmessage = function(oEvent) {
//            // handle term event
//            console.log(oEvent.data);
//};
/*

self.addEventListener("message", function (oEvent) {
    if (oEvent.data.type == "r") {
        //continue running
        readTest.push("\n");
        elfRunNextInst();
    } else if (oEvent.data.type == "u") {
        // copy user input
        DAT = oEvent.data.inp;
        if (DAT == 'THIS_IS_ESC') {
            readTest.push(DAT);
        } else {
            for (var x = 0; x < DAT.length; x++) {
                readTest.push(DAT.charAt(x));
            }
        }
        elfRunNextInst();
    }
}, false);
*/

const RISCV = new CPU();

function runCodeC(userIn) {
  //compilestat = document.getElementById("compilestatus");
  //compilestat.innerHTML = "Compile Status: Compiling, waiting for server response.";
  const filesList = ["./lib/riscv_compiled/vmlinux" ];

  handle_file_continue(filesList);

}

function GetBinaryFile(strURL, fnCallback, filesList, bBypassCache) {
  const callback = (bin) => {
    const lastElem = strURL.split("/");
    const fn = lastElem[lastElem.length - 1];
    fnCallback(RISCV, bin, fn, filesList, handle_file_continue);
  };
  const isonbrowser = false; // !globalThis.document
  if (isonbrowser) {
    fetch(strURL).then(res => res.bytes()).then(callback);
  } else {
    Deno.readFile(strURL).then(callback);
  }
};

function handle_file_continue(filesList) {
    //document.getElementById("testresult").innerHTML = "ELF not loaded";
    //tab = document.getElementById("regtable");
    //elfproptab = document.getElementById("elfprops");
    //debugtab = document.getElementById("debugprops");

    // execution pause
    //pauseExec = false;

    GetBinaryFile(filesList[0], chainedFileLoader, filesList.slice(1, filesList.length));
}

runCodeC();
