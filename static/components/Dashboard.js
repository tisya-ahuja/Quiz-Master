export default {
    template: `
        <div>
            <h4 style="margin: 30px; position: absolute; top: 30px; left: 0px; color: #B19079;">
                Welcome {{userData.username}} (DOB: {{userData.dob}}, Qualification: {{userData.qualification}})
            </h4>
            <div class="container justify-content-end flex-grow-1" style="padding: 20px; margin: 90px 0% 50px 0%; position: relative;">
                <!-- Subjects Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5 style="margin: 0;">Subjects</h5>
                    </div>
                    <div class="card-body">
                        <div id="subjectsCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                <div v-for="(subject, index) in subject" :class="['carousel-item', { active: index === 0 }]" :key="subject.id">
                                    <div style="padding: 20px; text-align: center; color: #B19079;">
                                        <h5>{{ subject.name }}</h5>
                                        <p>{{ subject.description }}</p>
                                        <router-link :to="{name:'chapter', params:{id:subject.id}}" class="btn" style="color: #B19079;">
                                            Go to chapters <i class="bi bi-arrow-right"></i>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <!-- Carousel Controls -->
                            <button class="carousel-control-prev" type="button" data-bs-target="#subjectsCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#subjectsCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Scores Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: white;">
                        <h5>Scores</h5>
                    </div>
                    <div class="card-body">
                        <div style="max-height: 150px; overflow-y: scroll;">
                            <table style="width: 100%; border-collapse: collapse; background-color: transparent;">
                                <thead>
                                    <tr style="color: #B19079; border-bottom: 1px solid #B19079;">
                                        <th style="padding: 10px; text-align: left;">Quiz Name</th>
                                        <th style="padding: 10px; text-align: left;">Score</th>
                                        <th style="padding: 10px; text-align: left;">Percentage</th>
                                        <th style="padding: 10px; text-align: left;">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="scoreItem in score" :key="scoreItem.id" style="color: #B19079;">
                                        <td style="padding: 10px;">{{ scoreItem.quiz }}</td>
                                        <td style="padding: 10px;">{{ scoreItem.total }}</td>
                                        <td style="padding: 10px;">{{ scoreItem.percentage }}%</td>
                                        <td style="padding: 10px;">{{ scoreItem.timestamp }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Summary Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: white;">
                        <h5>Summary</h5>
                    </div>
                    <div class="card-body" style="display: flex; flex-direction: column; align-items: center;">
                        <div v-if="quizAverages.length > 0" style="width: 100%;">
                            <table style="max-height: 150px; overflow-y: scroll; width: 100%; border-collapse: collapse; background-color: transparent;">
                                <thead>
                                    <tr>
                                        <th>Quiz</th>
                                        <th>Average %</th>
                                        <th>Attempts</th>
                                        <th>Best %</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="avg in quizAverages" :key="avg.quiz">
                                        <td>{{ avg.quiz }}</td>
                                        <td>{{ avg.average }}%</td>
                                        <td>{{ avg.attempts }}</td>
                                        <td>{{ avg.best }}%</td>
                                        <td>
                                            <div style="width:100px; background:#eee; border-radius:5px; overflow:hidden;">
                                                <div :style="{width: avg.average + '%', background:'#B19079', height:'10px'}"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <canvas v-if="quizAverages.length > 0" id="quizAvgChart" height="120"></canvas>
                        </div>
                        <div v-else style="color: #B19079; text-align: center;">
                            <p>No quiz attempts yet. Take a quiz to see your quiz-wise performance!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            userData: "",
            subject: [],
            score: [],
            _quizAvgChart: null
        };
    },
    computed: {
        quizAverages() {
            const quizMap = {};
            for (let s of this.score) {
                if (!quizMap[s.quiz]) {
                    quizMap[s.quiz] = { total: 0, count: 0, best: 0 };
                }
                quizMap[s.quiz].total += s.percentage;
                quizMap[s.quiz].count += 1;
                if (s.percentage > quizMap[s.quiz].best) quizMap[s.quiz].best = s.percentage;
            }
            let result = [];
            for (let name in quizMap) {
                let entry = quizMap[name];
                if (entry.count > 0) {
                    result.push({
                        quiz: name,
                        average: (entry.total / entry.count).toFixed(2),
                        attempts: entry.count,
                        best: entry.best.toFixed(2)
                    });
                }
            }
            return result.sort((a, b) => b.average - a.average);
        }
    },
    mounted() {
        this.loadUserData();
        this.loadSubjects().then(() => this.loadScores());
    },
    methods: {
        loadUserData() {
            fetch('/api/home', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userData = data)
            .catch(error => console.error("Error loading user data:", error));
        },
        loadSubjects() {
            return fetch('/api/getsubject', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.subject = data;
            })
            .catch(error => {
                this.subject = [];
                console.error("Error loading subjects:", error);
            });
        },
        loadScores() {
            fetch('/api/getscore', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.score = data;
                this.$nextTick(() => this.renderQuizAvgChart());
            })
            .catch(error => {
                this.score = [];
                console.error("Error loading scores:", error);
            });
        },
        renderQuizAvgChart() {
            if (!this.quizAverages.length) return;
            const ctx = document.getElementById('quizAvgChart');
            if (!ctx) return;
            if (this._quizAvgChart) {
                this._quizAvgChart.destroy();
            }
            this._quizAvgChart = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.quizAverages.map(s => s.quiz),
                    datasets: [{
                        label: 'Average Percentage',
                        data: this.quizAverages.map(s => s.average),
                        backgroundColor: '#B19079',
                        borderColor: '#B19079',
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Average Percentage by Quiz',
                            color: '#B19079',
                            font: { size: 16, weight: 'bold', family: 'inherit' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#B19079' }
                        },
                        x: {
                            ticks: { color: '#B19079' }
                        }
                    }
                }
            });
        }
    }
};