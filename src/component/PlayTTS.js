import '../App.css';

import React, { useState, useEffect, useRef } from "react";

import { Howl, Howler } from 'howler';

import TrieSearch from 'trie-search';

import Crunker from 'crunker';

import accc12 from '../Data/CeCedict';
import CeCedict2 from '../Data/CeCedict2';

import Translate from './Translate';
// import UserInput from './UserInput';
// import trie from '../Data/test.js';
// more detail methods in test
// WITH_TONE_NUMBER--数字代表声调，WITHOUT_TONE--不带声调，WITH_TONE_MARK--带声调

// output: xià#mén#nǐ#hǎo#dà#shà#xià#mén


function PlayTTS() {

  let resultPinyin = [];
// let userInput;

  var testMe = 'ni3hao3';

  let crunker = new Crunker();





  let ttsList;

  function PrepareInput() {
    var punctuationLess = testMe.replace(/[^a-zA-Z0-9 ]+/g, '').replace('/ {2,}/', ' ')
    var treatSpace = punctuationLess.replace(/ /g, "_");

    // //    console.log("🚀 ~ file: PlayTTS.js ~ line 133 ~ PrepareInput ~ punctuationLess", punctuationLess)

    //    var splitAfterNumber =punctuationLess.split(/([0-9]+)/)
    //    console.log("🚀 ~ file: PlayTTS.js ~ line 136 ~ PrepareInput ~ splitAfterNumber", splitAfterNumber)
    // //    console.log("🚀 ~ file: PlayTTS.js ~ line 133 ~ PrepareInput ~ punctuationLess", punctuationLess)

    // var str = 'hai2zi5    yi3jing1 ta1men5 you3 liang3ge4 hai2zi5    yi3jing1';

    ttsList = treatSpace
      .replace(/\s{1,}/g, ' ')
      .split(/(?<=\d+)/g);


    // console.log(out);


  }


  // const [current, setCurrent] = useState(ttsList[0]);
  let currentInt = 0;
  let audio_url = 'assets/'
  const [ttsOnScreen, setTtsOnScreen] = useState('');

  let preparePinyin = [];
let testMe2 = []; //['assets/Zhe4.mp3', 'assets/ge5.mp3', 'assets/shi2.mp3']
  function DownloadTTS() {
    for (let i = 0; i < resultPinyin.length; i++) {

      // if (resultPinyin[i].length > 1) {
        var splitPinyin = resultPinyin[i].split(' ');
        for (let j = 0; j < splitPinyin.length; j++) {
          if (splitPinyin[j] === "") {
            console.log('empty')
          } else {
            if (splitPinyin[j].length === 1) {
              preparePinyin.push('pause');
            } else {
        preparePinyin.push(splitPinyin[j]);
      }
    }
    }
    }
    console.log("🚀 ~ file: PlayTTS.js ~ line 79 ~ DownloadTTS ~ preparePinyin", preparePinyin)
    for (let i = 0; i < preparePinyin.length; i++) {
      let addPath = 'assets/' + preparePinyin[i] + '.mp3'
testMe2.push(addPath)
console.log("🚀 ~ file: PlayTTS.js ~ line 89 ~ DownloadTTS ~ testMe2", testMe2)
    }
    
    console.log("🚀 ~ file: PlayTTS.js ~ line 88 ~ DownloadTTS ~ testMe2", testMe2)
    crunker
      .fetchAudio(...testMe2)
      .then((buffers) => crunker.concatAudio(buffers))
      .then((merged) => crunker.export(merged, 'audio/mp3'))
      .then((output) => crunker.download(output.blob))
      .catch((error) => {
        throw new Error(error)
      });
    }
  
    function Play() {

      for (let i = 0; i < resultPinyin.length; i++) {

        // if (resultPinyin[i].length > 1) {
          console.log("🚀 ~ file: PlayTTS.js ~ line 107 ~ Play ~ resultPinyin", resultPinyin)
          var splitPinyin = resultPinyin[i].split(' ');

          for (let j = 0; j < splitPinyin.length; j++) {
            if (splitPinyin[j] === "") {
              console.log('empty')
            } else {
              if (splitPinyin[j].length === 1) {
                preparePinyin.push('pause');
              } else {
          preparePinyin.push(splitPinyin[j]);
        }
      }
      }
      }
      console.log("🚀 ~ file: PlayTTS.js ~ line 79 ~ DownloadTTS ~ preparePinyin", preparePinyin)
      for (let i = 0; i < preparePinyin.length; i++) {
        let addPath = 'assets/' + preparePinyin[i] + '.mp3'
  testMe2.push(addPath)
      }
      console.log("🚀 ~ file: PlayTTS.js ~ line 125 ~ Play ~ testMe2", testMe2)
      crunker
      .fetchAudio(...testMe2)
      .then((buffers) => {
        return crunker.concatAudio(buffers);
      })
      .then((merged) => {
        return crunker.play(merged);
      })
    }

  function resetAndPlay() {
    console.log("🚀 ~ file: PlayTTS.js ~ line 76 ~ resetAndPlay ~ resultPinyin", resultPinyin)
for (let i = 0; i < resultPinyin.length; i++) {

  // if (resultPinyin[i].length > 1) {
    var splitPinyin = resultPinyin[i].split(' ');
    for (let j = 0; j < splitPinyin.length; j++) {
      if (splitPinyin[j] === "") {
        console.log('empty')
      } else {
        if (splitPinyin[j].length === 1) {
          preparePinyin.push('pause');
        } else {
    preparePinyin.push(splitPinyin[j]);
  }
}
}
}
    currentInt = 0;
    play_audio()
  }

  function play_audio() {
    let sound = new Howl({
      src: [audio_url + preparePinyin[currentInt] + '.mp3'],

      volume: 1,
      onend: function () {
        currentInt++;
        if (preparePinyin.length > currentInt) {
          console.log('testMe');
          let playingSound = preparePinyin[currentInt];
          // console.log("🚀 ~ file: PlayTTS.js ~ line 90 ~ play_audio ~ resultPinyin[currentInt].length", resultPinyin[currentInt].length)
         play_audio(playingSound + '.mp3')
        
          // setTtsOnScreen(playingSound);
          playingSound === 'pause' ? setTtsOnScreen((preparePinyin) => [
            ...preparePinyin,
            ['\n'],
          ]) : setTtsOnScreen((preparePinyin) => [
            ...preparePinyin,
            [playingSound],
          ])


        } else {
          if (preparePinyin.length === currentInt) {
            currentInt = 0;
          }
        }
      }
    });
    sound.play();
  }

  // function GetAll1Leng() {
  //   let all1Leng = [];
  //   for (let i = 0; i < window.ceCedict2.length - 1; i++) {
  //     const traditional1 = window.ceCedict2[i].split(/ (.*)/s);
  //     let traditional = traditional1[0];
  //     if (traditional.length === 1) {
  //       all1Leng.push(traditional);
  //     }
  //   }
  //   console.log("total", all1Leng);
  //   console.log("Unique", [... new Set(all1Leng)]);
  //   var total = all1Leng.length;
  //   console.log("🚀 ~ file: PlayTTS.js ~ line 103 ~ GetAll1Leng ~ total", total)
  //   var unique = [... new Set(all1Leng)].length;
  //   console.log("🚀 ~ file: PlayTTS.js ~ line 105 ~ GetAll1Leng ~ unique", unique)
  //   console.log((100 * parseInt(unique)) / parseInt(total))
  // }

  // const trie = new TrieSearch('chinese');
  // let searchedWord;

  // function CeCedictToTrie() {

  //   // probably can search for exact matx=ches after trrie returns matches then i just check which mathc is exact match
  //   if (trie.size === 0) {


  //     for (let i = 0; i < window.ceCedict2.length - 1; i++) {
  //       // for (let i = 0; i < 10000; i++) {
  //       const traditional1 = window.ceCedict2[i].split(/ (.*)/s);
  //       let traditional = traditional1[0];
  //       const simplified2 = traditional1[1].split(/\[(.*)/s);
  //       let simplified = simplified2[0];
  //       const pinyinEnglish = simplified2[1].split(/\](.*)/s);
  //       let pinyin = pinyinEnglish[0];
  //       let english = pinyinEnglish[1];
  //       function toUnicode(str) {
  //         var res = [];
  //         for (var i = 0; i < str.length; i++) {
  //           res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  //         }
  //         return "\\u" + res.join("\\u");
  //       }
  //       const people = [
  //         { chinese: toUnicode(traditional) + ' ' + toUnicode(simplified.replace(/^\s+|\s+$/g, '')), pinyin: pinyin, english: english },
  //       ];
  //       trie.addAll(people);

  //     }
  //     console.log('initialise trie')

  //   } else {

  //     function toUnicode(str) {
  //       var res = [];
  //       for (var i = 0; i < str.length; i++) {
  //         res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  //       }
  //       return "\\u" + res.join("\\u");
  //     }

  //     searchedWord = `歡迎你來臺灣！
  //     請問你是陳月美小姐嗎？
  //     是的。謝謝你來接我們。

  //     這是王先生。
  //     你好。我姓王，叫開文。
  //     你們好。歡迎你們來臺灣。
  //     請喝茶。
  //     謝謝。很好喝。請問這是什麼茶？
  //     這是烏龍茶。臺灣人喜歡喝茶。開文，你們日本人呢？
  //     他不是日本人。
  //     對不起，你是哪國人？
  //     我是美國人。
  //     開文，你要不要喝咖啡？
  //     謝謝！我不喝咖啡，我喜歡喝茶。
  //     我的家人
  //     這是我家。請進！`;
  //     let splitSearchedWord = searchedWord.split('');
  //     console.log("🚀 ~ file: PlayTTS.js ~ line 151 ~ CeCedictToTrie ~ splitSearchedWord", splitSearchedWord)

  //     // let indexSegment = 2;
  //     // let firstNextWord = 0;
  //     let checkWord;
  //     let resultWordsList = [];
      
  //     SegmentWords()
  //     function SegmentWords() {
  //       console.log('*********************************************')
  //       for (let i = 2; i <= splitSearchedWord.length; i++) {
  //         checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1];
  //         // console.log("🚀 ~ file: PlayTTS.js ~ line 162 ~ SegmentWords ~ searchWords", searchWords)
  //         if (CheckIfWord(checkWord).length === 0) {
  //           console.log("🚀 ~ file: PlayTTS.js ~ line 200 ~ SegmentWords ~ CheckIfWord(checkWord).length", CheckIfWord(checkWord).length)
  //           checkWord = splitSearchedWord[i - 2];
  //           CheckIfWord(checkWord).length === 0 ? console.log(checkWord) : console.log(GetWord(checkWord))
  //           CheckIfWord(checkWord).length === 0 ? resultPinyin.push(checkWord) : resultPinyin.push(GetWord(checkWord));
  //           // 1 character or non character
  //         } else {
  //           checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i];
  //           if (CheckIfWord(checkWord).length === 0) {
  //             checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1];
  //             // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
  //             console.log(GetWord(checkWord));
  //             resultPinyin.push(GetWord(checkWord));
  //             i++
  //             // 2 character
  //           } else {
  //             checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1];
  //             if (CheckIfWord(checkWord).length === 0) {
  //               checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i];
  //               // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
  //               console.log(GetWord(checkWord))
  //               resultPinyin.push(GetWord(checkWord));
  //               i = i + 2
  //               // 3 character
  //             } else {
  //               checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2];
  //               if (CheckIfWord(checkWord).length === 0) {
  //                 checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1];
  //                 // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
  //                 console.log(GetWord(checkWord))
  //                 resultPinyin.push(GetWord(checkWord));
  //                 i = i + 3
  //                 // 4 character
  //               } else {
  //                 checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2] + splitSearchedWord[i + 3];
  //                 if (CheckIfWord(checkWord).length === 0) {
  //                   checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2];
  //                   // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
  //                   console.log(GetWord(checkWord))
  //                   resultPinyin.push(GetWord(checkWord));
  //                   i = i + 4
  //                   // 5 character
  //                 } else {
  //                   checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2] + splitSearchedWord[i + 3] + splitSearchedWord[i + 4];
  //                   if (CheckIfWord(checkWord).length === 0) {
  //                     checkWord = splitSearchedWord[i - 2] + splitSearchedWord[i - 1] + splitSearchedWord[i] + splitSearchedWord[i + 1] + splitSearchedWord[i + 2] + + splitSearchedWord[i + 3];
  //                     // console.log("🚀 ~ file: PlayTTS.js ~ line 191 ~ SegmentWords ~ checkWord", checkWord)
  //                     console.log(GetWord(checkWord))
  //                     resultPinyin.push(GetWord(checkWord));
  //                     i = i + 5
  //                     // 6 character
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //           //  console.log(resultPinyin)
  //     }



  //     // CheckIfWord('怎麼')
  //     function CheckIfWord(searchWordCheck) {

  //       // let getEactMatch = trie.search(toUnicode(searchWordF));
  //       // console.log("🚀 ~ file: PlayTTS.js ~ line 233 ~ CheckIfWord ~ trie.search(toUnicode(searchWordF))", trie.search(toUnicode(searchWordCheck)))
  //       return trie.search(toUnicode(searchWordCheck));
  //     }
  //     // GetWord('我們')
  //     function GetWord(searchWordGet) {

  //       let getEactMatch = trie.search(toUnicode(searchWordGet));


  //       for (let i = 0; i < getEactMatch.length; i++) {
  //         let splitTradSimpl = getEactMatch[i].chinese.split(/ (.*)/s);
  //         // console.log("🚀 ~ file: PlayTTS.js ~ line 255 ~ GetWord ~ splitTradSimpl", splitTradSimpl)
  //         // let splitSimplified
  //         for (let e = 0; e <= splitTradSimpl.length; e++) {
  //           if (splitTradSimpl[e] === toUnicode(searchWordGet)) {
  //             // console.log("🚀 ~ file: PlayTTS.js ~ line 258 ~ CeCedictToTrie ~ splitTradSimpl", getEactMatch[i])
  //             return getEactMatch[i];
  //           }
  //         }
  //       }
  //     }

  //   }
  // }







  return (
    <div className="App">
      <header className="App-header">
        <Translate resultPinyin={resultPinyin} />
        {/* <UserInput userInput={userInput} /> */}
        <button className="Play-button" onClick={() => Play()}>Play</button>
        <button className="Download-button" onClick={() => DownloadTTS()}>Download TTS</button>

{/* <br></br>
        <button onClick={() => window.CeCedictToTrie()}>Initialise Trie</button> */}
        {/* <button onClick={() => sampleFunction()}>Get 1 word length</button> */}

        <div>
          <p>{ttsOnScreen}</p></div>
      </header>
    </div>
  );
}

export default PlayTTS;
