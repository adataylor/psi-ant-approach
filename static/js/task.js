/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	// "instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	// "instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

// In javascript, defining a function as `async` makes it return  a `Promise`
// that will "resolve" when the function completes. Below, `init` is assigned to be the
// *returned value* of immediately executing an anonymous async function.
// This is done by wrapping the async function in parentheses, and following the
// parentheses-wrapped function with `()`.
// Therefore, the code within the arrow function (the code within the curly brackets) immediately
// begins to execute when `init is defined. In the example, the `init` function only
// calls `psiTurk.preloadPages()` -- which, as of psiTurk 3, itself returns a Promise.
//
// The anonymous function is defined using javascript "arrow function" syntax.
const init = (async () => {
    await psiTurk.preloadPages(pages);
})()

var instructionPages = [ // add as a list as many pages as you like
	// "instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	// "instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

var is_done = false;
	
var response_handler = function(e) {
	// if (!listening) return;
	var keyCode = e.keyCode;
	var response;

	switch (keyCode) {
		case 82:
			// "R"
			response = "red";
			break;
		case 71:
			// "G"
			response = "green";
			break;
		case 66:
			// "B"
			response = "blue";
			break;

		// ADA ADDITIONS
		case 32: // Page up
			response="robot_me"
			break;

		case 38: // Page up
			response="robot_away"
			break;
		case 40: // Page down
			response="robot_me";
			break;

		case 27: // ESC
			response='completed_with_escape';
			is_done = true;
			break;

		default:
			response = "";
			break;
	}

	// if (response.length>0) {
	// 	listening = false;
	// 	var hit = response == stim[1];
	var buttonTime = new Date().getTime();
	// var rt = buttonTime - wordon;

	psiTurk.recordTrialData({'phase':"TEST",
                             'guessTime':buttonTime,
                              'keycode': keyCode,
                              'response_type': response
                         	}
                         );
	psiTurk.saveData();
	// window.alert("Saved!");
	// }
	// window.alert("Interesting click!");

};

// Register the response handler that is defined above to handle any
// key down events.
// $("body").focus().keydown(response_handler); 

document.addEventListener('keydown', response_handler, true);


/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {

	    ////////////////////
    //Global Variables//
    ////////////////////

    //Define timeline
    var timeline = []; //specify the jsPsych timeline to which all trials/blocks are pushed

    //Participant Identifier
    var identifier = jsPsych.randomization.randomID(15); //random alphanumeric string for ID
    jsPsych.data.addProperties({
      participant: identifier,
      expt: 'ANT'
    }); //add participant ID to data output

const rand_iti = (min, max) => Math.floor(Math.random() * (max - min)) + min; //to generate a random ITI

/* Timeline Variables */

//We Need to repeat each trial type here 6x to directly replicate Berman et al. (2008), which used 288 trials
var ant_trialvars = [
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/bottom-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/bottom-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/bottom-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN',cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/bottom-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/top-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/top-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/top-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/top-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/top-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/top-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/bottom-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'NO-CUE'},
  {cue: '/static/images/fixation.jpg',  targ: '/static/images/bottom-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'NO-CUE'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/bottom-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/bottom-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/bottom-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/bottom-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/top-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/top-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/top-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/top-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/top-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/top-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/bottom-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'CENTER'},
  {cue: '/static/images/center-cue.jpg',  targ: '/static/images/bottom-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'CENTER'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/bottom-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/bottom-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/bottom-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/bottom-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/top-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/top-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/top-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/top-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/top-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/top-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/bottom-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'DOUBLE'},
  {cue: '/static/images/both-cue.jpg',  targ: '/static/images/bottom-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'DOUBLE'},
  {cue: '/static/images/bottom-cue.jpg',  targ: '/static/images/bottom-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'SPATIAL'},
  {cue: '/static/images/bottom-cue.jpg',  targ: '/static/images/bottom-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'SPATIAL'},
  {cue: '/static/images/bottom-cue.jpg',  targ: '/static/images/bottom-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'SPATIAL'},
  {cue: '/static/images/bottom-cue.jpg',  targ: '/static/images/bottom-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'SPATIAL'},
  {cue: '/static/images/top-cue.jpg',  targ: '/static/images/top-congruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'CONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'SPATIAL'},
  {cue: '/static/images/top-cue.jpg',  targ: '/static/images/top-congruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'CONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'SPATIAL'},
  {cue: '/static/images/top-cue.jpg',  targ: '/static/images/top-incongruent-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'INCONGRUENT', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'SPATIAL'},
  {cue: '/static/images/top-cue.jpg',  targ: '/static/images/top-incongruent-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'INCONGRUENT', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'SPATIAL'},
  {cue: '/static/images/top-cue.jpg',  targ: '/static/images/top-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'UP', cue_type: 'SPATIAL'},
  {cue: '/static/images/top-cue.jpg',  targ: '/static/images/top-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'UP', cue_type: 'SPATIAL'},
  {cue: '/static/images/bottom-cue.jpg',  targ: '/static/images/bottom-noflank-l.jpg', correct_resp: 'ArrowLeft', flanker_type: 'NEUTRAL', flanker_middle: 'L', flanker_loc: 'DOWN', cue_type: 'SPATIAL'},
  {cue: '/static/images/bottom-cue.jpg',  targ: '/static/images/bottom-noflank-r.jpg', correct_resp: 'ArrowRight', flanker_type: 'NEUTRAL', flanker_middle: 'R', flanker_loc: 'DOWN', cue_type: 'SPATIAL'}
];

ant_trialvars = jsPsych.randomization.repeat(ant_trialvars, 1); //repeat each trial type 6 times for a grand total of 288 trials

/* Instruction Trials */

var inst_01 = '<p>Welcome. This part of the experiment will take about 20 minutes to complete.</p>Before you begin, please make sure that you are in a quiet location free from distractions.</p><p>(Press <b>&#8594;</b> on your keyboard to continue.)</p>';
var inst_02 = '<p>In this experiment you will see arrows pointing left or right</br>(e.g <b>&#8594; &#8594; &#8594; &#8594; &#8594;</b> or <b>&#8594; &#8594; &#8592; &#8594; &#8594;</b>)</br>presented randomly at the top or bottom of the screen.</p>'+
              '<p>Your job is to indicate which way the central (middle) arrow is pointing by pressing the corresponding arrow key on your keyboard.</p>'+
              '<p>Occasionally, you will only see a single arrow on the screen. When this happens, simply indicate which way the single arrow is pointing by pressing the corresponding arrow key on your keyboard.</p>'+
              '<p>(Press &#8592; to go back or &#8594; to continue)</p>';
var inst_03 = '<p>Before the arrows appear, an asterisk (*) will occasionally come up somewhere on the screen.</p>'+
              '<p>Irrespective of whether or where the * appears, it is important that you respond as quickly and accurately as possible by pressing the arrow key corresponding to the direction of the center arrow.</p>'+
              '<p>(Press &#8592; to go back or &#8594; to begin!)</p>';


var ant_inst = {
  type: 'instructions',
  pages: [inst_01, inst_02, inst_03],
  post_trial_gap: 1000
};

/* Main Procedure Trials */
var setHeight=500;

var ant_cue = {
  type: 'image-keyboard-response',
  stimulus: jsPsych.timelineVariable('cue'),
  stimulus_height: function(){return setHeight;},
  trial_duration: 100,
  choices: jsPsych.NO_KEYS
};

var ant_delay = {
  type: 'image-keyboard-response',
  stimulus: '/static/images/fixation.jpg',
  stimulus_height: function(){return setHeight;},
  trial_duration: 400,
  choices: jsPsych.NO_KEYS
};

var ant_target = {
  type: 'image-keyboard-response',
  stimulus: jsPsych.timelineVariable('targ'),
  stimulus_height: function(){return setHeight;},
  trial_duration: 1700,
  choices: ['ArrowRight', 'ArrowLeft'],
  data: {
    designation: 'ANT-RESPONSE',
    correct_resp: jsPsych.timelineVariable('correct_resp'),
    flanker_type: jsPsych.timelineVariable('flanker_type'),
    flanker_middle: jsPsych.timelineVariable('flanker_middle'),
    flanker_loc: jsPsych.timelineVariable('flanker_loc'),
    ANT_trialType: jsPsych.timelineVariable('cue_type')
  },
  on_finish: function(data){
    if(data.response == data.correct_resp){
      var gotitright = 1;
    } else {
      var gotitright = 0;
    }
    jsPsych.data.addDataToLastTrial({
      correct: gotitright
    });
  }
};

var ant_iti = {
  type: 'image-keyboard-response',
  stimulus: '/static/images/fixation.jpg',
  stimulus_height: function(){return setHeight;},
  trial_duration: function(){return rand_iti(600, 3200);},
  choices: jsPsych.NO_KEYS
};

var ant_procedure = {
  timeline: [ant_cue, ant_delay, ant_target, ant_iti],
  timeline_variables: ant_trialvars,
  randomize_order: true
};

/* Preload Images */
var img_preload = [
  '/static/images/both-cue.jpg', '/static/images/bottom-congruent-l.jpg', '/static/images/bottom-congruent-r.jpg', '/static/images/bottom-cue.jpg',
  '/static/images/bottom-incongruent-l.jpg', '/static/images/bottom-incongruent-r.jpg', '/static/images/bottom-noflank-l.jpg',
  '/static/images/bottom-noflank-r.jpg', '/static/images/center-cue.jpg', '/static/images/fixation.jpg', '/static/images/top-congruent-l.jpg',
  '/static/images/top-congruent-r.jpg', '/static/images/top-cue.jpg', '/static/images/top-incongruent-l.jpg',
  '/static/images/top-incongruent-r.jpg', '/static/images/top-noflank-l.jpg', '/static/images/top-noflank-r.jpg'
];

var ant_preload = {
  type: 'preload',
  images: img_preload
};

/* Wrap-Up Screen */
var ant_finish = {
  type: 'html-button-response',
  stimulus: '<p>Thank you for your responses!</p>',
  choices: ['Finish']
};


/////////////////////////
// fullscreen //
////////////////////////

var ant_fullscreen_enter = {
	type: 'fullscreen',
	fullscreen_mode: true,
};

var ant_fullscreen_exit = {
	type: 'fullscreen',
	fullscreen_mode: false,
};

/* Push Everything to Timeline */

timeline.push(ant_preload, ant_fullscreen_enter, ant_inst, ant_procedure, ant_fullscreen_exit, ant_finish);


    //Initialize the experiment
    jsPsych.init({
      timeline: timeline,
      on_finish: function() {
        var csvname = identifier + '.csv';
        jsPsych.data.get().localSave('csv', csvname);
      }
    });


};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
 // In this example `task.js file, an anonymous async function is bound to `window.on('load')`.
 // The async function `await`s `init` before continuing with calling `psiturk.doInstructions()`.
 // This means that in `init`, you can `await` other Promise-returning code to resolve,
 // if you want it to resolve before your experiment calls `psiturk.doInstructions()`.

 // The reason that `await psiTurk.preloadPages()` is not put directly into the
 // function bound to `window.on('load')` is that this would mean that the pages
 // would not begin to preload until the window had finished loading -- an unnecessary delay.
$(window).on('load', async () => {
    await init;
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
