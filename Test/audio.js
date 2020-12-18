//import * as tf from '@tensorflow/tfjs';
//import * as SpeechCommands from '../src';

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const MIN_EXAMPLES_PER_CLASS = 8;

async function app(){
  const baseRecognizer = speechCommands.create('BROWSER_FFT');
}

app();
baseRecognizer().then(ensureModelLoaded);

let recognizer;
let transferWords;
let transferRecognizer;
let transferDurationMultiplier;

startButton.addEventListener('click', () => {
  const activeRecognizer =
      transferRecognizer == null ? recognizer : transferRecognizer;
  populateCandidateWords(activeRecognizer.wordLabels());

const suppressionTimeMillis = 1000;
activeRecognizer
    .listen(
        result => {
          plotPredictions(
              predictionCanvas, activeRecognizer.wordLabels(), result.scores,
              3, suppressionTimeMillis);
        },
        {
          includeSpectrogram: true,
          suppressionTimeMillis,
          probabilityThreshold: Number.parseFloat(probaThresholdInput.value)
        })
    .then(() => {
      startButton.disabled = true;
      stopButton.disabled = false;
      showCandidateWords();
      logToStatusDisplay('Streaming recognition started.');
    })
    .catch(err => {
      logToStatusDisplay(
          'ERROR: Failed to start streaming display: ' + err.message);
    });
});

stopButton.addEventListener('click', () => {
  const activeRecognizer =
      transferRecognizer == null ? recognizer : transferRecognizer;
  activeRecognizer.stopListening()
      .then(() => {
        startButton.disabled = false;
        stopButton.disabled = true;
        hideCandidateWords();
        logToStatusDisplay('Streaming recognition stopped.');
      })
      .catch(err => {
        logToStatusDisplay(
            'ERROR: Failed to stop streaming display: ' + err.message);
      });
});

function predictWord() {
 // Array of words that the recognizer is trained to recognize.
 const words = recognizer.wordLabels();
 recognizer.listen(({scores}) => {
   // Turn scores into a list of (score,word) pairs.
   scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
   // Find the most probable word.
   scores.sort((s1, s2) => s2.score - s1.score);
   document.querySelector('#console').textContent = scores[0].word;
 }, {probabilityThreshold: 0.75});
}

async function app() {
 recognizer = speechCommands.create('BROWSER_FFT');
 predictWord();
}

app();

recognizer().then(ensureModelLoaded);

//const transferRecognizer = baseRecognizer.createTransfer('colors');

transferRecognizer().then(collectExample('red'));
transferRecognizer().then(collectExample('orange'));
transferRecognizer().then(collectExample('yellow'));
transferRecognizer().then(collectExample('green'));
transferRecognizer().then(collectExample('blue'));
transferRecognizer().then(collectExample('purple'));
transferRecognizer().then(collectExample('pink'));
transferRecognizer().then(collectExample('_background_noise_'));
transferRecognizer().then(collectExample('red'));
transferRecognizer().then(collectExample('orange'));
transferRecognizer().then(collectExample('yellow'));
transferRecognizer().then(collectExample('green'));
transferRecognizer().then(collectExample('blue'));
transferRecognizer().then(collectExample('purple'));
transferRecognizer().then(collectExample('pink'));
transferRecognizer().then(collectExample('_background_noise_'));

console.log(transferRecognizer.countExamples());

transferRecognizer().then(train({
  epochs: 25,
  callback: {
    onEpochEnd: async (epoch, logs) => {
      console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
    }
  }
}));

transferRecognizer().then(listen(result => {
  // - result.scores contains the scores for the new vocabulary, which
  //   can be checked with:
  const words = transferRecognizer.wordLabels();
  // `result.scores` contains the scores for the new words, not the original
  // words.
  for (let i = 0; i < words; ++i) {
    console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
  }
}, {probabilityThreshold: 0.75}));

// Stop the recognition in 10 seconds.
setTimeout(() => transferRecognizer.stopListening(), 10e3);
