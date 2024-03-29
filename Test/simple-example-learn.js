jsPsych.plugins["simple-example-learn"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'simple-example-learn',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // display stimulus
    var html = '<div id="jspsych-html-mic-button-response-stimulus">'+trial.stimulus+'</div>';

    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-html-mic-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-html-mic-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-mic-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    display_element.innerHTML = html;

    // start time
    var start_time = performance.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-mic-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

//ensure model is loaded before listening, otherwise send error message
    if(modelLoaded) {
          learnWords();
       }else{
         alert("Not Loaded");
       }

    // store response
    var response = {
      rt: null,
      button: null
    };

    //var myOptions = new transferRecognizerTrain.collectExampleOptions = {durationSec: 1};
    //var options = new transferRecognizerTrain.collectExampleOptions(durationSec = 1);
    //myOptions.durationSec = 1;
    //var options = {durationSec : 1};
    var options = new transferRecognizerTrain.collectExampleOptions({durationSec : 1});


    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-mic-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-mic-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-mic-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

/* async function learnWords(){
  document.getElementById('jspsych-html-mic-button-response-button-0').addEventListener('mousedown', function (event) {
 await transferRecognizerTrain.collectExample(choiceWord);
 function end_event(e) {
   document.removeEventListener('mousedown', move_event);
 }
 document.addEventListener('mouseup', end_event);
})} */

function learnWords() {
   document.getElementById('jspsych-html-mic-button-response-button-0').innerHTML="<button class='jspsych-btn' disabled>Next</button>";
   document.getElementById('colorWord').style.display='block';
   document.addEventListener('keyup', event => {
     if (event.code === 'Space') {
       console.log('Space pressed');
       collect()
       .then(() => {
         console.log('Stream started');
         document.getElementById('jspsych-html-mic-button-response-button-0').innerHTML="<button class='jspsych-btn'>Next</button>";
       });
     }
   });
}


async function collect() {

      await transferRecognizerTrain.collectExample(choiceWord, options);
     }



// activate microphone and collect example of color word
  /* async function startTraining() {
     document.getElementById('jspsych-html-mic-button-response-button-0').innerHTML="<button class='jspsych-btn' disabled>Next</button>";
      recognizer.listen(result => {
        candidateWords = recognizer.wordLabels();
        //create empty array to hold word scores
        let wordsAndProbs = [];

            for (let i = 0; i < candidateWords.length; ++i) {
              //push the word said by participant and it's score onto the array
              wordsAndProbs.push({ word: candidateWords[i], prob: result.scores[i]});
            }
            wordsAndProbs.sort((a, b) => (b.prob - a.prob));
            //word with the closest score to the word said by the participant is classified as topGuess
            const topGuess = wordsAndProbs[0].word;
          },
          {
            includeSpectrogram: true,
            probabilityThreshold: 0.7
          })
      .then(() => {
        console.log('Stream started');
        document.getElementById('colorWord').style.display='block';
      })
      .catch(err => {
        console.log('Failed to start streaming: ' + err.message);
      });

      //collects sound example of the word said by participant
      await transferRecognizerTrain.collectExample(choiceWord);

      turnOffMic();

}; */

//turn off microphone
  function turnOffMic(){
    document.getElementById('jspsych-html-mic-button-response-button-0').innerHTML="<button class='jspsych-btn'>Next</button>";
      recognizer.stopListening();
  };


  return plugin;
})();
