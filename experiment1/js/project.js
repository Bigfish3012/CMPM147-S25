// project.js - purpose and description here
// Author: Chengkun Li
// Date: 04/07/2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
  const fillers = {
    person_name: ["坤坤", "Optimus Prime", "ジョセフ・ジョースター", "JOJO", "坂田銀時", "鸡哥", "夜神月", "勇者", "Woody", "Neo", "$person_name and $person_name", "$person_name, $person_name, and $person_name", "哈吉咪", "曼波"],
    location: ["地狱", "hell", "your back", "the past", "牢笼", "深渊", "sea", "oblivion", "ruins", "limbo", "another dimension"],
    adj: ["帥氣","阴阳怪气的", "肾虚的", "mischievous", "quirky", "eccentric", "infamous", "peculiar", ],
    item: ["阳光青提", "篮球", ,"如意金箍棒","ロンギヌスの槍","和道一文字", "Proto-adamantium Shield", "Dead Note"],
    baddies: ["Dio Brando", "フリーザ", "云山", "魂天帝", "無惨", "Joker", "Hannibal Lecter", "Hades", "Magneto", "Lord Voldemort", "Xenomorph", " T-1000", "Bowser"],
    messages: ["we are done", "everything is gone", "this is where we part ways", "this conversation is over. For good", "get busy living, or get busy dying", 
                "你我再无任何瓜葛", "我们便不在有任何联系", "来世再见", "我们永世不见", "到此为止",
                "過去は水に流す。でも未来はない", "この関係、清算する", "大人の別れ方でいきましょう"],
    ending:["海的那边是什么", "三十年河东，三十年河西，莫欺少年穷", "Something for nothing", "我们都是小怪兽，都将被正义的奥特曼，杀死！", "I'll Be Waiting for You. In Hell.", "座れよ、ライナ。", "心臓を捧げよ！", "塔塔开！"],
  };
  
  const template = `$person_name, CAN YOU HEAR ME?!
  
  Listen! The people on $location need your help! You can't just ignore them because they are $adj. $baddies is also on the way. We don't have too much time. Take my $item, and help them please. Please, just this time!
  
  After this, $messages.


  $ending
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    box.innerText = story;
  }
  
  /* global clicker */
  clicker.onclick = generate;
  
  generate();
  
}

// let's get this party started - uncomment me
main();