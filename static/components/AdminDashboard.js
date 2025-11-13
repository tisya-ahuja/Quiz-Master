export default {
    template: `
        <div>
            <h4 style="margin: 30px; position: absolute; top: 30px; left: 0px; color: #B19079;">
                Welcome {{userData.username}} (DOB: {{userData.dob}}, Qualification: {{userData.qualification}})
                <button @click="csvExport" class="btn btn-secondary">Download CSV</button>
            </h4>
            <div class="container justify-content-end flex-grow-1" style="padding: 20px; margin: 90px 0% 50px 0%; position: relative;">
                <!-- Search Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5 style="margin: 0;">Search</h5>
                    </div>
                    <div class="card-body" style="display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: center;">
                        <input v-model="searchUser" class="form-control" placeholder="Search Users..." style="max-width: 250px; border: 1px solid #B19079; color: #B19079; background: transparent;">
                        <input v-model="searchSubject" class="form-control" placeholder="Search Subjects..." style="max-width: 250px; border: 1px solid #B19079; color: #B19079; background: transparent;">
                        <input v-model="searchQuiz" class="form-control" placeholder="Search Quizzes..." style="max-width: 250px; border: 1px solid #B19079; color: #B19079; background: transparent;">
                    </div>
                </div>
                <!-- Subjects Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5 style="margin: 0;">
                            Subjects
                            <button data-bs-toggle="modal" data-bs-target="#addsubject" style="color: #EFEBE0; background-color: #B19079; border: transparent; float: right;">
                                <i class="bi bi-plus-square"></i>
                            </button>
                        </h5>
                    </div>
                    <!-- Add Subject Modal -->
                    <div class="modal fade" id="addsubject" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add Subject</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="mb-3">
                                            <label for="name" class="col-form-label" style="color: #B19079;">Subject Name:</label>
                                            <input v-model="subjectData.name" type="text" class="form-control" id="name" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                        </div>
                                        <div class="mb-3">
                                            <label for="description" class="col-form-label" style="color: #B19079;">Description:</label>
                                            <textarea v-model="subjectData.description" class="form-control" id="description" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;"></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer" style="background-color: #EFEBE0;">
                                    <button @click="addSubject" class="btn" data-bs-dismiss="modal" style="color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;"
                                        @mouseover="hoverBtn($event, true)" @mouseout="hoverBtn($event, false)">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="subjectsCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                <div v-for="(subject, index) in filteredSubjects" :class="['carousel-item', { active: index === 0 }]" :key="subject.id">
                                    <div style="padding: 20px; text-align: center; color: #B19079;">
                                        <h4>{{ subject.name }}</h4>
                                        <p>{{ subject.description }}</p>
                                        <p>
                                            <span>
                                                <button data-bs-toggle="modal" data-bs-target="#updatesubject" class="btn" style="color: #B19079;" @click="editSubject(subject)">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button class="btn" style="color: #B19079;" @click="deleteSubject(subject.id)">
                                                    <i class="bi bi-trash3"></i>
                                                </button>
                                            </span>
                                        </p>
                                        <router-link :to="{name:'chapter', params:{id:subject.id}}" class="btn" style="color: #B19079;">Go to chapters <i class="bi bi-arrow-right"></i></router-link>
                                    </div>
                                </div>
                            </div>
                            <!-- Update Subject Modal -->
                            <div class="modal fade" id="updatesubject" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                        <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Subject</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form>
                                                <div class="mb-3">
                                                    <label for="name" class="col-form-label" style="color: #B19079;">Subject Name:</label>
                                                    <input v-model="subjectData.name" type="text" class="form-control" id="name" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="description" class="col-form-label" style="color: #B19079;">Description:</label>
                                                    <textarea v-model="subjectData.description" class="form-control" id="description" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;"></textarea>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer" style="background-color: #EFEBE0;">
                                            <button @click="updateSubject" class="btn" data-bs-dismiss="modal" style="color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;"
                                                @mouseover="hoverBtn($event, true)" @mouseout="hoverBtn($event, false)">
                                                Edit
                                            </button>
                                        </div>
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
                <!-- Users Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5>Users</h5>
                    </div>
                    <div class="card-body">
                        <div style="max-height: 150px; overflow-y: scroll;">
                            <table style="width: 100%; border-collapse: collapse; background-color: transparent;">
                                <thead>
                                    <tr style="color: #B19079; border-bottom: 1px solid #B19079;">
                                        <th style="padding: 10px; text-align: left;">Username</th>
                                        <th style="padding: 10px; text-align: left;">Email</th>
                                        <th style="padding: 10px; text-align: left;">Qualification</th>
                                        <th style="padding: 10px; text-align: left;">Date of Birth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="user in filteredUsers" :key="user.id" style="color: #B19079;">
                                        <td style="padding: 10px;">{{ user.username }}</td>
                                        <td style="padding: 10px;">{{ user.email }}</td>
                                        <td style="padding: 10px;">{{ user.qualification }}</td>
                                        <td style="padding: 10px;">{{ user.dob }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Scores Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
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
                                    <tr v-for="scoreItem in filteredScores" :key="scoreItem.id" style="color: #B19079;">
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
                <!-- Summary Section-->
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
            users: [],
            subjectData: {
                id: "",
                name: "",
                description: ""
            },
            searchUser: "",
            searchSubject: "",
            searchQuiz: "",
            _quizAvgChart: null
        };
    },
    computed: {
        filteredUsers() {
            const term = this.searchUser.trim().toLowerCase();
            return this.users.filter(user =>
                user.role !== 'admin' &&
                (!term ||
                    user.username.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    (user.qualification && user.qualification.toLowerCase().includes(term)) ||
                    (user.dob && user.dob.toLowerCase().includes(term))
                )
            );
        },
        filteredSubjects() {
            const term = this.searchSubject.trim().toLowerCase();
            return this.subject.filter(subject =>
                !term ||
                subject.name.toLowerCase().includes(term) ||
                (subject.description && subject.description.toLowerCase().includes(term))
            );
        },
        filteredScores() {
            const term = this.searchQuiz.trim().toLowerCase();
            return this.score.filter(score =>
                !term ||
                (score.quiz && score.quiz.toLowerCase().includes(term)) ||
                (score.timestamp && score.timestamp.toLowerCase().includes(term))
            );
        },
        quizAverages() {
            if (!this.score.length) return [];
            const quizMap = {};
            for (let s of this.score) {
                if (!quizMap[s.quiz]) quizMap[s.quiz] = [];
                quizMap[s.quiz].push(s.percentage);
            }
            return Object.keys(quizMap).map(q => {
                const arr = quizMap[q];
                return {
                    quiz: q,
                    average: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
                    attempts: arr.length,
                    best: Math.max(...arr).toFixed(2)
                };
            });
        }
    },
    mounted() {
        this.loadAdmin();
        this.loadSubject();
        this.loadUser();
        this.loadScore();
    },
    methods: {
        hoverBtn(event, hover) {
            event.target.style.backgroundColor = hover ? '#B19079' : 'transparent';
            event.target.style.color = hover ? '#EFEBE0' : '#B19079';
        },
        loadAdmin() {
            fetch('/api/admin', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.userData = data);
        },
        loadSubject() {
            fetch('/api/getsubject', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.subject = data);
        },
        addSubject() {
            fetch('/api/createsubject', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.subjectData)
            })
            .then(response => response.json())
            .then(() => this.loadSubject());
        },
        updateSubject() {
            fetch(`/api/updatesubject/${this.subjectData.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.subjectData)
            })
            .then(response => response.json())
            .then(() => this.loadSubject());
        },
        deleteSubject(id) {
            fetch(`/api/deletesubject/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(() => this.loadSubject());
        },
        editSubject(subject) {
            this.subjectData = { ...subject };
        },
        loadUser() {
            fetch('/api/getuser', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.users = data;
            });
        },
        loadScore() {
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
                    labels: this.quizAverages.map(q => q.quiz),
                    datasets: [{
                        label: 'Average %',
                        data: this.quizAverages.map(q => q.average),
                        backgroundColor: '#B19079',
                        borderColor: '#EFEBE0',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Average Quiz Percentage',
                            color: '#B19079',
                            font: { size: 16, weight: 'bold', family: 'inherit' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#B19079', font: { size: 13, family: 'inherit' } },
                            grid: { color: '#EFEBE0' }
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#B19079', font: { size: 13, family: 'inherit' } },
                            grid: { color: '#EFEBE0' }
                        }
                    }
                }
            });
        },
        csvExport(){
            fetch('/api/export')
            .then(response => response.json())
            .then(data => {
                window.location.href = `/api/csv_result/${data.id}`
            })
        }
    }
};