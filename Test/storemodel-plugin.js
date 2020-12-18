jsPsych.plugins['html-speech-recognizer'] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'html-speech-recognizer',
    parameters: {
      words: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined
      },
      key: {
        type: jsPsych.plugins.parameterType.BUTTON,
        default: 0
      }
    }
  }

  plugin.trial = function(display_element, trial){

var trial_data{
  parameter_name: "parameter value"
};

function show_stimulus(){
  display_element.innerHTML = "<p>" + trial.words + "</p>";

 jsPsych.pluginAPI.clearAllTimeouts();
  var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };
}

show_stimulus();

    jsPsych.finishTrial(trial_data);
  };

  return plugin;

})();
