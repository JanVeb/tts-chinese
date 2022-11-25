import React, { useState, useEffect, useRef } from 'react';
import TrieSearch from 'trie-search';
// import UserInput from "./UserInput";

import ceCedict2 from '../Data/CeCedict';

function Translate({ resultPinyin }) {
  let resultAll = [];
  let resultChinese = [];

  const [input, setInput] = useState('');
  // let userInput = "";
  // function GetAll1Leng() {
  //     let all1Leng = [];
  //     for (let i = 0; i < window.ceCedict2.length - 1; i++) {
  //       const traditional1 = window.ceCedict2[i].split(/ (.*)/s);
  //       let traditional = traditional1[0];
  //       if (traditional.length === 1) {
  //         all1Leng.push(traditional);
  //       }
  //     }
  //     console.log("total", all1Leng);
  //     console.log("Unique", [... new Set(all1Leng)]);
  //     var total = all1Leng.length;
  //     console.log("🚀 ~ file: PlayTTS.js ~ line 103 ~ GetAll1Leng ~ total", total)
  //     var unique = [... new Set(all1Leng)].length;
  //     console.log("🚀 ~ file: PlayTTS.js ~ line 105 ~ GetAll1Leng ~ unique", unique)
  //     console.log((100 * parseInt(unique)) / parseInt(total))
  //   }

  function SplitPinyin(pinyinInput) {
    // return pinyinInput.split(' ')
    console.log(
      '🚀 ~ file: Translate.js ~ line 37 ~ SplitPinyin ~ pinyinInput',
      input
    );
    console.log('*************************************');
    console.log(input.split(' '));
  }

  // function toUnicode(str) {
  //   var res = [];
  //   for (var i = 0; i < str.length; i++) {
  //     res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  //   }
  //   let removeFirstSlash =  "\\u" + res.join("\\u")
  //   return removeFirstSlash.replace("\\", "");

  // }

  function toUnicode(str) {
    return Array.from(str)
      .map((c) =>
        c.charCodeAt(0) < 128
          ? c.charCodeAt(0).toString(16)
          : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
      )
      .join('');
  }

  function hexToUtf8(hex) {
    return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
  }

  // function convertFromHex(hex) {
  // var hex = hex.toString();//force conversion
  // var str = '';
  // for (var i = 0; i < hex.length; i += 2)
  // str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  // console.log("🚀 ~ file: Translate.js ~ line 46 ~ convertFromHex ~ str", str)
  // return str;
  // }

  function convertFromHex(hex, str) {
    try {
      str = decodeURIComponent(hex.replace(/(..)/g, '%$1'));
    } catch (e) {
      str = hex;
      console.log('invalid hex input: ' + hex);
    }
    return str;
  }

  const trie = new TrieSearch('chinese');
  let searchedWord;

  function CeCedictToTrie() {
    // probably can search for exact matx=ches after trrie returns matches then i just check which mathc is exact match
    if (trie.size === 0) {
      console.log(
        '🚀 ~ file: Translate.js ~ line 89 ~ CeCedictToTrie ~ ceCedict2',
        ceCedict2
      );
      console.log(
        '🚀 ~ file: Translate.js ~ line 89 ~ CeCedictToTrie ~ window.ceCedict2',
        window.ceCedict2
      );

      for (let i = 0; i < window.ceCedict2.length - 1; i++) {
        // for (let i = 0; i < 10000; i++) {
        const traditional1 = window.ceCedict2[i].split(/ (.*)/s);
        let traditional = traditional1[0];
        const simplified2 = traditional1[1].split(/\[(.*)/s);
        let simplified = simplified2[0];
        const pinyinEnglish = simplified2[1].split(/\](.*)/s);
        let pinyin = pinyinEnglish[0];
        let english = pinyinEnglish[1];
        // function toUnicode(str) {
        //   var res = [];
        //   for (var i = 0; i < str.length; i++) {
        //     res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        //   }
        //   return "\\u" + res.join("\\u");
        // }
        const people = [
          {
            chinese:
              toUnicode(traditional) +
              ' ' +
              toUnicode(simplified.replace(/^\s+|\s+$/g, '')),
            pinyin: pinyin,
            english: english,
          },
        ];
        trie.addAll(people);
      }
      console.log('initialise trie');
    } else {
      searchedWord = input;
      //   console.log("🚀 ~ file: Translate.js ~ line 71 ~ CeCedictToTrie ~ UserInput.userInput", UserInput.userInput)

      let splitSearchedWord = searchedWord.split('');
      console.log(
        '🚀 ~ file: PlayTTS.js ~ line 151 ~ CeCedictToTrie ~ splitSearchedWord',
        splitSearchedWord
      );

      // let indexSegment = 2;
      // let firstNextWord = 0;
      let checkWord;
      let foundWord = true;

      SegmentWords();
      function SegmentWords() {
        for (let i = 0; i < splitSearchedWord.length; i++) {
          if (foundWord === true) {
            i + 1 < splitSearchedWord.length
              ? (checkWord = splitSearchedWord[i] + splitSearchedWord[i + 1])
              : (checkWord = splitSearchedWord[i]);
            foundWord = false;
          }
          if (CheckIfWord(checkWord).length > 0) {
            checkWord = checkWord + splitSearchedWord[i + 2];
          } else {
            let getWord = checkWord.slice(0, -1);
            if (GetWord(getWord) === undefined) {
              while (GetWord(getWord) === undefined && getWord.length > 1) {
                let getWordSlice = getWord.slice(0, -1);
                getWord = getWordSlice;
                // console.log(
                //   '🚀 ~ file: Translate.js ~ line 151 ~ SegmentWords ~ getWord',
                //   getWord
                // );
              }
              // console.log(
              //   '🚀 ~ file: Translate.js ~ line 150 ~ SegmentWords ~ getWord',
              //   getWord
              // );
              resultAll.push(getWord);
              foundWord = true;
            } else {
              resultAll.push(GetWord(getWord));
              foundWord = true;
            }
          }
        }
      }

      // CheckIfWord('怎麼')
      function CheckIfWord(searchWordCheck) {
        // let getEactMatch = trie.search(toUnicode(searchWordF));
        // console.log("🚀 ~ file: PlayTTS.js ~ line 233 ~ CheckIfWord ~ trie.search(toUnicode(searchWordF))", trie.search(toUnicode(searchWordCheck)))
        return trie.search(toUnicode(searchWordCheck));
      }
      // GetWord('我們')
      function GetWord(searchWordGet) {
        let getEactMatch = trie.search(toUnicode(searchWordGet));

        for (let i = 0; i < getEactMatch.length; i++) {
          let splitTradSimpl = getEactMatch[i].chinese.split(/ (.*)/s);
          // console.log("🚀 ~ file: PlayTTS.js ~ line 255 ~ GetWord ~ splitTradSimpl", splitTradSimpl)
          // let splitSimplified
          for (let e = 0; e <= splitTradSimpl.length; e++) {
            if (splitTradSimpl[e] === toUnicode(searchWordGet)) {
              // console.log("🚀 ~ file: PlayTTS.js ~ line 258 ~ CeCedictToTrie ~ splitTradSimpl", getEactMatch[i])
              return getEactMatch[i];
            }
          }
        }
      }
    }
    console.log(
      '🚀 ~ file: Translate.js ~ line 184 ~ CeCedictToTrie ~ resultAll',
      resultAll
    );
    for (let i = 0; i < resultAll.length; i++) {
      if (resultAll[i] != '') {
        if (resultAll[i] != '*') {
          if (resultAll[i] != undefined) {
            resultPinyin.push(resultAll[i].pinyin);
            // console.log(resultAll[i].chinese);
            let splitChinese;
            //   resultAll[i].chinese != undefined
            //     ? resultAll[i].chinese.split(' ')
            //     : undefined;
            if (resultAll[i].chinese != undefined) {
              splitChinese = resultAll[i].chinese.split(' ');
            }
            console.log(
              '🚀 ~ file: Translate.js ~ line 218 ~ CeCedictToTrie ~ splitChinese',
              splitChinese
            );
            let traditional =
              splitChinese != undefined
                ? hexToUtf8(splitChinese[0])
                : undefined;
            let simplified =
              splitChinese != undefined
                ? hexToUtf8(splitChinese[1])
                : undefined;
            let tradSimplified = traditional + ' ' + simplified;
            // if (testMe != undefined) {
            //   console.log('----------- ' + hexToUtf8(testMe[0]));
            // }
            // if (testMe != undefined) {
            //   console.log('111111111 ' + hexToUtf8(testMe[1]));
            // }
            resultChinese.push(tradSimplified);
          }
        } else {
          // resultPinyin.push('*')
          // resultChinese.push('*')
          resultPinyin.push(resultAll[i].pinyin);
          let testMe = resultAll[i].chinese.split(' ');
          if (testMe != undefined) {
            console.log('----------- ' + hexToUtf8(testMe));
          }
          resultChinese.push(hexToUtf8(resultAll[i].chinese));
        }
      }
    }
    console.log(
      '🚀 ~ file: Translate.js ~ line 159 ~ CeCedictToTrie ~ resultPinyin',
      resultPinyin
    );
    console.log(
      '🚀 ~ file: Translate.js ~ line 152 ~ CeCedictToTrie ~ resultChinese',
      resultChinese
    );
  }

  return (
    <div>
      <button className="Init-button" onClick={() => CeCedictToTrie()}>
        Initialise Trie
      </button>
      <button
        onClick={() => console.log(hexToUtf8('e4b8ade69687e4b8ade69687'))}
      >
        Convert to char
      </button>
      <button onClick={() => SplitPinyin()}>Convert to char</button>
      <br></br>
      <input
        className="Input-hanzi"
        type="text"
        placeholder="traditional or simplified"
        onChange={(event) => setInput(event.target.value)}
      />
      <input
        className="Input-pinyin"
        type="text"
        placeholder="pinyin with numbers"
        onChange={(event) => setInput(event.target.value)}
      />
      {/* <button onClick={() => {alert(input) }}>
        click me
      </button> */}
      {/* <UserInput input={input} setInput={setInput} /> */}
    </div>
  );
}

export default Translate;

// SegmentWords()
// function SegmentWords() {
//   console.log('*********************************************')
//   for (let i = 2; i <= splitSearchedWord.length; i++) {
//     checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1];
//     // console.log("🚀 ~ file: PlayTTS.js ~ line 162 ~ SegmentWords ~ searchWords", searchWords)
//     if (CheckIfWord(checkWord).length === 0) {
//       console.log("🚀 ~ file: PlayTTS.js ~ line 200 ~ SegmentWords ~ CheckIfWord(checkWord).length", CheckIfWord(checkWord).length)
//       checkWord = splitSearchedWord[i - 2];
//       CheckIfWord(checkWord).length === 0 ? console.log(checkWord) : console.log(GetWord(checkWord))
//       CheckIfWord(checkWord).length === 0 ? resultAll.push('*') : resultAll.push(GetWord(checkWord));
//       // 1 character or non character
//     } else {
//       checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i];
//       if (CheckIfWord(checkWord).length === 0) {
//         checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1];
//         // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
//         console.log(GetWord(checkWord));
//         resultAll.push(GetWord(checkWord));
//         i++
//         // 2 character
//       } else {
//         checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1];
//         if (CheckIfWord(checkWord).length === 0) {
//           checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i];
//           // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
//           console.log(GetWord(checkWord))
//           resultAll.push(GetWord(checkWord));
//           i = i + 2
//           // 3 character
//         } else {
//           checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2];
//           if (CheckIfWord(checkWord).length === 0) {
//             checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1];
//             // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
//             console.log(GetWord(checkWord))
//             resultAll.push(GetWord(checkWord));
//             i = i + 3
//             // 4 character
//           } else {
//             checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2] + splitSearchedWord[i + 3];
//             if (CheckIfWord(checkWord).length === 0) {
//               checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2];
//               // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
//               console.log(GetWord(checkWord))
//               resultAll.push(GetWord(checkWord));
//               i = i + 4
//               // 5 character
//             } else {
//               checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2] + splitSearchedWord[i + 3] + splitSearchedWord[i + 4];
//               if (CheckIfWord(checkWord).length === 0) {
//                 checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2] + + splitSearchedWord[i + 3];
//                 // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
//                 console.log(GetWord(checkWord))
//                 resultAll.push(GetWord(checkWord));
//                 i = i + 5
//                 // 6 character
//               }
//             }
//           }
//         }
//       }
//     }
//   }
//       //  console.log(resultAll)
// }
