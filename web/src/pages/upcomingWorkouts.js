import FiveLiftsClient from '../api/fiveLiftsClient';
import Header from '../components/header';
import BindingClass from '../util/bindingClass';
import DataStore from '../util/DataStore';

/**
 * Logic needed for the upcoming workouts page of the website.
 */
class UpcomingWorkouts extends BindingClass {
    constructor() {
        super();
        this.bindClassMethods(['mount', 'displayUpcomingWorkouts', 'isCurrentUser', 'isLoggedIn'], this);
        this.dataStore = new DataStore();
        this.header = new Header(this.dataStore);
    }

    /**
     * Add the header to the page and load the MusicPlaylistClient.
     */
    async mount() {
        document.getElementById('startWorkoutButton').addEventListener('click', this.startWorkout);
        this.header.addHeaderToPage();
        this.client = new FiveLiftsClient();
        await this.isCurrentUser();
        await this.isLoggedIn();
    }

    /**
     * Method to run when mounted. Call the FiveLiftsService to get the
     * upcoming workouts.
     */
    async displayUpcomingWorkouts() {
        const upcomingWorkouts = await this.client.getUpcomingWorkouts();

        const upcomingWorkoutsDisplay = document.getElementById('upcomingWorkouts');
        upcomingWorkoutsDisplay.classList.remove('hidden');

        const startWorkoutButton = document.getElementById('startWorkoutButton');
        startWorkoutButton.classList.remove('hidden');

        const upcomingWorkoutsTitle = document.getElementById('upcomingWorkoutsTitle');
        upcomingWorkoutsTitle.innerText = "UPCOMING WORKOUTS";

        for (let workout in upcomingWorkouts) {
            let workoutNumber = `workout${Number(workout) + 1}`;
            let currentWorkout = upcomingWorkouts[workout];
            if (currentWorkout.workoutType == 'WORKOUT_A') {
                displayWorkoutA(currentWorkout, workoutNumber);
            } else {
                displayWorkoutB(currentWorkout, workoutNumber);
            }
        }
    }

    async isCurrentUser() {
        const currentUser =  await this.client.getIsCurrentUser();
        if (!currentUser) {
            const upcomingWorkoutsCard = document.getElementById('upcomingWorkoutsCard');
            upcomingWorkoutsCard.innerHTML = `
            <h1 class="notCurrentUser">Please enter your starting weights first.</h1>
            <button class="startingWeightsButton" id="startingWeightsButton" type="button">ENTER STARTING WEIGHTS</button>
            `;
            document.getElementById('startingWeightsButton').addEventListener('click', this.redirectToStartingWeights);
        } else {
            this.displayUpcomingWorkouts();
        }
    }

    async isLoggedIn() {
        const isLoggedIn = await this.client.isLoggedIn();

        if (!isLoggedIn) {
            window.location.href = `/index.html`;
        }
    }

    startWorkout() {
        window.location.href = `/currentWorkout.html`;
    }

    redirectToStartingWeights() {
        window.location.href = `/startingWeights.html`;
    }
}

/**
 * Helper function to display date in worded format.
 * @param {*} year 
 * @param {*} month 
 * @param {*} day 
 * @returns worded format
 */
function getDisplayDate(year, month, day) {
        const workoutDate = new Date(year, month, day);
        const dayOfWeekName = workoutDate.toLocaleDateString('default', {
            weekday: 'long'
        });
        const monthName = workoutDate.toLocaleDateString(`default`, {
            month: 'long'
        });
        return `${dayOfWeekName}, ${monthName} ${day}`
}

/**
 * Helper function to display Workout A.
 * @param {*} workoutA 
 * @param {*} workoutNumber 
 */
function displayWorkoutA(workoutA, workoutNumber) {
    let displayDate = getDisplayDate(workoutA.workoutDate[0],
        (workoutA.workoutDate[1] - 1), workoutA.workoutDate[2]);

    let workoutCard = document.getElementById(workoutNumber);
    workoutCard.innerHTML = `     
    <div class="workoutTypeAndDate">
        <p class="type">Workout A</p>
        <p class="date">${displayDate}</p> 
    </div>
    <div class="exercise">
        <h3>Squat</h3>
        <div class="weight">
            <h3>5x5</h3>
            <h3 class="setWeight">${workoutA.squatWeight}lbs</h3>
        </div>
    </div>
    <div class="exercise">
        <h3>Bench Press</h3>
        <div class="weight">
            <h3>5x5</h3>
            <h3 class="setWeight">${workoutA.benchPressWeight}lbs</h3>
        </div>
    </div>
    <div class="exercise">
        <h3>Barbell Row</h3>
        <div class="weight">
            <h3>5x5</h3>
            <h3 class="setWeight">${workoutA.barbellRowWeight}lbs</h3>
        </div>
    </div>`
}

/**
 * Helper function to display Workout B.
 * @param {*} workoutA 
 * @param {*} workoutNumber 
 */
function displayWorkoutB(workoutB, workoutNumber) {
    let displayDate = getDisplayDate(workoutB.workoutDate[0],
        (workoutB.workoutDate[1] - 1), workoutB.workoutDate[2]);

    let workoutCard = document.getElementById(workoutNumber);
    workoutCard.innerHTML = `     
    <div class="workoutTypeAndDate">
        <p class="type">Workout B</p>
        <p class="date">${displayDate}</p> 
    </div>
    <div class="exercise">
        <h3>Squat</h3>
        <div class="weight">
            <h3>5x5</h3>
            <h3 class="setWeight">${workoutB.squatWeight}lbs</h3>
        </div>
    </div>
    <div class="exercise">
        <h3>Overhead Press</h3>
        <div class="weight">
            <h3>5x5</h3>
            <h3 class="setWeight">${workoutB.overheadPressWeight}lbs</h3>
        </div>
    </div>
    <div class="exercise">
        <h3>Deadlift</h3>
        <div class="weight">
            <h3>1x5</h3>
            <h3 class="setWeight">${workoutB.deadliftWeight}lbs</h3>
        </div>
    </div>`
}

/**
 * Main method to run when the page contents have loaded.
 */
const main = async () => {
    const upcomingWorkouts = new UpcomingWorkouts();
    upcomingWorkouts.mount();
};

window.addEventListener('DOMContentLoaded', main);