import React, { useState } from "react";
import TrieSearch from 'trie-search';
function Translate({ resultPinyin }) {
    let resultAll = [];
    const [input, setInput] = useState('')
  const trie = new TrieSearch('chinese');
  let searchedWord;
  function CeCedictToTrie() {
    if (trie.size === 0) {
      for (let i = 0; i < window.ceCedict2.length - 1; i++) {
        const traditional1 = window.ceCedict2[i].split(/ (.*)/s);
        let traditional = traditional1[0];
        const simplified2 = traditional1[1].split(/\[(.*)/s);
        let simplified = simplified2[0];
        const pinyinEnglish = simplified2[1].split(/\](.*)/s);
        let pinyin = pinyinEnglish[0];
        let english = pinyinEnglish[1];
        function toUnicode(str) {
          var res = [];
          for (var i = 0; i < str.length; i++) {
            res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
          }
          return "\\u" + res.join("\\u");
        }
        const people = [
          { chinese: toUnicode(traditional) + ' ' + toUnicode(simplified.replace(/^\s+|\s+$/g, '')), pinyin: pinyin, english: english },
        ];
        trie.addAll(people);
      }
      console.log('initialise trie')
    } else {
      function toUnicode(str) {
        var res = [];
        for (var i = 0; i < str.length; i++) {
          res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return "\\u" + res.join("\\u");
      }
      searchedWord = input;
      let splitSearchedWord = searchedWord.split('');
      console.log("🚀 ~ file: PlayTTS.js ~ line 151 ~ CeCedictToTrie ~ splitSearchedWord", splitSearchedWord)
      let checkWord;
      let foundWord = true;
      SegmentWords()
      function SegmentWords() {
        for (let i = 0; i < splitSearchedWord.length; i++) {
          if (foundWord === true) {
            i + 1 < splitSearchedWord.length ? checkWord = splitSearchedWord[i] + splitSearchedWord[i + 1] : checkWord = splitSearchedWord[i];
          foundWord = false;
          }
          if (CheckIfWord(checkWord).length > 0) {
            checkWord = checkWord + splitSearchedWord[i + 2];
          } else {
          let getWord = checkWord.slice(0, -1);
          if (GetWord(getWord) === undefined) {
            resultAll.push('*')
            foundWord = true;
          } else {
          resultAll.push(GetWord(getWord));
          foundWord = true;
      }
    }
      }
    }
      function CheckIfWord(searchWordCheck) {
        return trie.search(toUnicode(searchWordCheck));
      }
      function GetWord(searchWordGet) {
        let getEactMatch = trie.search(toUnicode(searchWordGet));
        for (let i = 0; i < getEactMatch.length; i++) {
          let splitTradSimpl = getEactMatch[i].chinese.split(/ (.*)/s);
          for (let e = 0; e <= splitTradSimpl.length; e++) {
            if (splitTradSimpl[e] === toUnicode(searchWordGet)) {
              return getEactMatch[i];
            }
          }
        }
      }
    }
    console.log("🚀 ~ file: Translate.js ~ line 184 ~ CeCedictToTrie ~ resultAll", resultAll)
    for (let i = 0; i < resultAll.length; i++) {
      if (resultAll[i] != "") {
          if (resultAll[i] != "*") {
            if (resultAll[i] != undefined) {
        resultPinyin.push(resultAll[i].pinyin)
            }
          } else {
        resultPinyin.push('*')
          }
      }
    }
    console.log("🚀 ~ file: Translate.js ~ line 159 ~ CeCedictToTrie ~ resultPinyin", resultPinyin)
  }
return (
<div>
        <button className="Init-button" onClick={() => CeCedictToTrie()}>Initialise Trie</button>
        <br></br>
        <input className="Input-hanzi" type="text" placeholder='traditional or simplified'
        onChange={event => setInput(event.target.value)}
      />
              <input className="Input-pinyin" type="text" placeholder='pinyin with numbers'
        onChange={event => setInput(event.target.value)}
      />
        </div>
  )
  }
  export default Translate;