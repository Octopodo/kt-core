import { runTests } from "kt-testing-suite-core";
// import { KT_Core } from "../src";
// import "./patterns.mixin.test";
// import "./patterns.extendarray.test";
import "./string.test";
// import "./objectSpread.test";

// function testMyRegexp() {
//     const testRegexp = new RegExp("test/.*\\.test\\.ts$");
//     const testLiteralRegexp = /test\/.*\.test\.ts$/;
//     $.writeLine("Running tests matching:", testRegexp.toString());
//     $.writeLine(
//         "Running tests matching (literal):",
//         testLiteralRegexp.toString()
//     );
// }

// testMyRegexp();
runTests();
