import React, {useState} from "react";
import Papa from "papaparse";
import {text} from "./UnicodeData.json";
import {unicodeToString} from "./util/conversions";

function App() {
    const [chars, setChars] = useState([]);
    const [regex, setRegex] = useState("");

    function fetchCharacters(evt) {
        evt.preventDefault();
        const categories = [...evt.target.getElementsByTagName("input")].filter(value => value.checked).map(value => value.value);

        console.log(categories);
        let blocks = [];
        let block = undefined;
        let letters = [];

        Papa.parse(text, {
            delimiter: ";",
            // download: true,
            step: (results, parser) => {
                if (categories.includes(results.data[2])) {
                    if (!block) {
                        block = {
                            beginning: results.data[0],
                            count: 1,
                            end: undefined
                        };
                    }
                    else {
                        const previousLetter = letters[letters.length - 1].unicode;

                        if (previousLetter && parseInt(previousLetter, 16) + 1 !== parseInt(results.data[0], 16)) {
                            block.end = previousLetter;
                            blocks.push(block);
                            block = {
                                beginning: results.data[0],
                                count: 1,
                                end: undefined
                            };
                        }
                        else {
                            block.count++;
                        }
                    }

                    letters.push({
                        unicode: results.data[0],
                        description: results.data[1],
                        category: results.data[2]
                    });
                }
            },
            complete: () => {
                let calculatedRegex = "[";

                for (let i = 0; i < blocks.length; i++) {
                    if (blocks[i].count > 2) {
                        calculatedRegex += "\\u{" + blocks[i].beginning + "}-" + "\\u{" + blocks[i].end + "}";
                    }
                    else if (blocks[i].beginning === blocks[i].end){
                        calculatedRegex += "\\u{" + blocks[i].beginning + "}";
                    }
                    else {
                        calculatedRegex += "\\u{" + blocks[i].beginning + "}\\u{" + blocks[i].end + "}";
                    }
                }


                calculatedRegex += "]";
                setChars(letters);
                setRegex(calculatedRegex);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    return (
        <div className="App">
            <h1>Character Fetcher</h1>

            <form onSubmit={fetchCharacters}>
                <div>
                    <div>
                        <b>Letter</b> <input value={"L"} type="checkbox"/>
                    </div>
                    <div>
                        Uppercase Letter <input value={"Lu"} type="checkbox"/>
                    </div>
                    <div>
                        Lowercase Letter <input value={"Ll"} type="checkbox"/>
                    </div>
                    <div>
                        Titlecase Letter <input value={"Lt"} type="checkbox"/>
                    </div>
                    <div>
                        Modifier Letter <input value={"Lm"} type="checkbox"/>
                    </div>
                    <div>
                        Other Letter <input value={"Lo"} type="checkbox"/>
                    </div>
                </div>
                <div>
                    <div>
                        <b>Mark</b> <input value={"M"} type="checkbox"/>
                    </div>
                    <div>
                        Non-Spacing Mark <input value={"Mn"} type="checkbox"/>
                    </div>
                    <div>
                        Spacing Combining Mark <input value={"Mc"} type="checkbox"/>
                    </div>
                    <div>
                        Enclosing Mark <input value={"Me"} type="checkbox"/>
                    </div>
                </div>
                <div>
                    <div>
                        <b>Number</b> <input value={"N"} type="checkbox"/>
                    </div>
                    <div>
                        Decimal Digit Number <input value={"Nd"} type="checkbox"/>
                    </div>
                    <div>
                        Letter Number <input value={"Nl"} type="checkbox"/>
                    </div>
                    <div>
                        Other Number <input value={"No"} type="checkbox"/>
                    </div>
                </div>
                <div>
                    <div>
                        <b>Symbol</b> <input value={"S"} type="checkbox"/>
                    </div>
                    <div>
                        Math Symbol <input value={"Sm"} type="checkbox"/>
                    </div>
                    <div>
                        Currency Symbol <input value={"Sc"} type="checkbox"/>
                    </div>
                    <div>
                        Modifier Symbol <input value={"Sk"} type="checkbox"/>
                    </div>
                    <div>
                        Other Symbol <input value={"So"} type="checkbox"/>
                    </div>
                </div>
                <div>
                    <div>
                        <b>Punctuation</b> <input value={"P"} type="checkbox"/>
                    </div>
                    <div>
                        Connector Punctuation <input value={"Pc"} type="checkbox"/>
                    </div>
                    <div>
                        Dash Punctuation <input value={"Pd"} type="checkbox"/>
                    </div>
                    <div>
                        Open Punctuation <input value={"Ps"} type="checkbox"/>
                    </div>
                    <div>
                        Close Punctuation <input value={"Pe"} type="checkbox"/>
                    </div>
                    <div>
                        Initial Punctuation <input value={"Pi"} type="checkbox"/>
                    </div>
                    <div>
                        Final Punctuation <input value={"Pf"} type="checkbox"/>
                    </div>
                    <div>
                        Other Punctuation <input value={"Po"} type="checkbox"/>
                    </div>
                </div>
                <button type={"submit"}>Fetch Characters</button>

            </form>

            <div>
                <textarea readOnly={true} value={regex}></textarea>
            </div>
            <div>
                <table>
                    <caption>Found Characters</caption>
                    <thead>
                    <tr>
                        <th>Unicode</th>
                        <th>Plain text</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chars.map(value => {
                        return (
                            <tr>
                                <td>{value.unicode}</td>
                                <td>{unicodeToString(value.unicode)}</td>
                                <td>{value.description}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
