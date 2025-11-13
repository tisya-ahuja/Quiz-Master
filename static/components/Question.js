export default {
    template: `
        <div>
            <h4 style="margin: 30px; position: absolute; top: 30px; left: 0px; color: #B19079;">
                Welcome {{userData.username}} (DOB: {{userData.dob}}, Qualification: {{userData.qualification}})
            </h4>
            <!-- Admin Section -->
            <div v-if="isAdmin" class="container justify-content-end flex-grow-1" style="padding: 20px; margin: 90px 0% 50px 0%; position: relative;">
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5 style="margin: 0;">
                            Questions
                            <button data-bs-toggle="modal" data-bs-target="#addquestion" style="color: #EFEBE0; background-color: #B19079; border: transparent; float: right;">
                                <i class="bi bi-plus-square"></i>
                            </button>
                        </h5>
                    </div>
                    <!-- Add Question Modal -->
                    <div class="modal fade" id="addquestion" tabindex="-1" aria-labelledby="addQuestionLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                    <h1 class="modal-title fs-5" id="addQuestionLabel">Add Question</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="addQuestion">
                                        <div class="mb-3">
                                            <label class="col-form-label" style="color: #B19079;">Statement:</label>
                                            <input v-model="questionData.statement" type="text" class="form-control" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;" required>
                                        </div>
                                        <div class="mb-3" v-for="opt in ['a','b','c','d']" :key="opt">
                                            <label class="col-form-label" style="color: #B19079;">Option {{opt.toUpperCase()}}:</label>
                                            <input v-model="questionData['option'+opt]" type="text" class="form-control" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="col-form-label" style="color: #B19079;">Correct Option:</label>
                                            <select v-model="questionData.correct" class="form-select" required>
                                                <option v-for="opt in ['optiona','optionb','optionc','optiond']" :value="opt">{{opt}}</option>
                                            </select>
                                        </div>
                                        <div class="modal-footer" style="background-color: #EFEBE0;">
                                            <button type="submit" class="btn" style="color: #B19079; border: 1px solid #B19079; background-color: transparent;">
                                                Add
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Update Question Modal -->
                    <div class="modal fade" id="updatequestion" tabindex="-1" aria-labelledby="updateQuestionLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                    <h1 class="modal-title fs-5" id="updateQuestionLabel">Update Question</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="updateQuestion">
                                        <div class="mb-3">
                                            <label class="col-form-label" style="color: #B19079;">Statement:</label>
                                            <input v-model="questionData.statement" type="text" class="form-control" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;" required>
                                        </div>
                                        <div class="mb-3" v-for="opt in ['a','b','c','d']" :key="opt">
                                            <label class="col-form-label" style="color: #B19079;">Option {{opt.toUpperCase()}}:</label>
                                            <input v-model="questionData['option'+opt]" type="text" class="form-control" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="col-form-label" style="color: #B19079;">Correct Option:</label>
                                            <select v-model="questionData.correct" class="form-select" required>
                                                <option v-for="opt in ['optiona','optionb','optionc','optiond']" :value="opt">{{opt}}</option>
                                            </select>
                                        </div>
                                        <div class="modal-footer" style="background-color: #EFEBE0;">
                                            <button type="submit" class="btn" style="color: #B19079; border: 1px solid #B19079; background-color: transparent;">
                                                Edit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="max-height: 200px; overflow-y: scroll;">
                        <table style="max-height: 150px; overflow-y: scroll; width: 100%; border-collapse: collapse; background-color: transparent;">
                            <thead>
                                <tr style="color: #B19079; border-bottom: 1px solid #B19079;">
                                    <th>Statement</th>
                                    <th>Option A</th>
                                    <th>Option B</th>
                                    <th>Option C</th>
                                    <th>Option D</th>
                                    <th>Correct</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="q in questions" :key="q.id">
                                    <td>{{ q.statement }}</td>
                                    <td>{{ q.optiona }}</td>
                                    <td>{{ q.optionb }}</td>
                                    <td>{{ q.optionc }}</td>
                                    <td>{{ q.optiond }}</td>
                                    <td>{{ q.correct ? q.correct.toUpperCase() : '' }}</td>
                                    <td>
                                        <button data-bs-toggle="modal" data-bs-target="#updatequestion" class="btn btn-sm" style="color: #B19079;" @click="editQuestion(q)">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button class="btn btn-sm ms-2" style="color: #B19079;" @click="deleteQuestion(q.id)">
                                            <i class="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- User Section -->
            <div v-else class="container" style="padding: 15px; margin: 90px 0% 50px 0%; position: relative;">
                <div class="row g-1">
                    <div class="col">
                        <div class="container" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;max-height:380px;overflow-y: scroll;">
                            <form v-for="question in questions" :key="question.id" style="color: #B19079;">
                                <div class="mb-3">
                                    <label class="col-form-label">{{question.statement}}</label>
                                </div>
                                <div class="form-check" v-for="opt in ['a','b','c','d']" :key="opt">
                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        :name="'option_' + question.id"
                                        :id="'option'+opt + '_' + question.id"
                                        :value="'option'+opt"
                                        v-model="userAnswers[question.id]"
                                        :disabled="quizSubmitted"
                                    >
                                    <label class="form-check-label" :for="'option'+opt + '_' + question.id">
                                        {{question['option'+opt]}}
                                    </label>
                                </div>
                                <hr>
                            </form>
                            <button
                                v-if="!isAdmin && !quizSubmitted"
                                @click="submit_quiz"
                                class="btn"
                                style="margin:10px; color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;"
                                @mouseover="hoverBtn($event, true)"
                                @mouseout="hoverBtn($event, false)">
                                Submit
                            </button>
                        </div>
                    </div>
                    <div class="col-sm-1">
                        <div class="container" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;color: #B19079;">
                            <h5>
                                <i class="bi bi-clock"></i>
                                {{ formattedTime }}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            userData: "",
            questions: [],
            questionData: {
                id: "",
                statement: "",
                correct: "",
                optiona: "",
                optionb: "",
                optionc: "",
                optiond: "",
                quiz_id: ""
            },
            isEditing: false,
            time_left: 0,
            timerInterval: null,
            userAnswers: {},
            quizSubmitted: false,
        };
    },
    computed: {
        isAdmin() {
            return localStorage.getItem("role") === "admin";
        },
        formattedTime() {
            const min = Math.floor(this.time_left / 60);
            const sec = this.time_left % 60;
            return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        }
    },
    mounted() {
        this.questionData.quiz_id = this.$route.params.id;
        this.loadQuizTimeAndQuestions();
        this.loadUserData();
    },
    beforeDestroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    },
    methods: {
        hoverBtn(event, hover) {
            event.target.style.backgroundColor = hover ? '#B19079' : 'transparent';
            event.target.style.color = hover ? '#EFEBE0' : '#B19079';
        },
        loadUserData() {
            const url = this.isAdmin ? '/api/admin' : '/api/home';
            fetch(url, {
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
        loadQuizTimeAndQuestions() {
            fetch(`/api/getquizinfo/${this.questionData.quiz_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(quiz => {
                let quizTime = parseInt(quiz.time, 10);
                if (isNaN(quizTime) || quizTime <= 0) quizTime = 1;
                this.time_left = quizTime * 60;
                if (!this.isAdmin) this.startTimer();
                this.loadQuestions();
            })
            .catch(error => {
                console.error("Error loading quiz info:", error);
                this.loadQuestions();
            });
        },
        loadQuestions() {
            fetch(`/api/getquestion/${this.questionData.quiz_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.questions = data)
            .catch(error => console.error("Error loading questions:", error));
        },
        startTimer() {
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                if (this.time_left > 0) {
                    this.time_left--;
                } else {
                    clearInterval(this.timerInterval);
                    this.submit_quiz(true);
                }
            }, 1000);
        },
        submit_quiz(auto = false) {
            if (this.quizSubmitted) return;
            this.quizSubmitted = true;
            if (this.timerInterval) clearInterval(this.timerInterval);

            let correct = 0;
            let total = this.questions.length;
            for (let q of this.questions) {
                if (this.userAnswers[q.id] && q.correct === this.userAnswers[q.id]) {
                    correct++;
                }
            }
            let percentage = total > 0 ? (correct / total) * 100 : 0;

            fetch('/api/createscore', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({
                    quiz_id: this.questionData.quiz_id,
                    total: correct,
                    percentage: percentage
                })
            })
            .then(response => response.json())
            .then(() => {
                if (auto) {
                    alert(`Time's up! Quiz submitted.\nScore: ${correct}/${total}\nPercentage: ${percentage.toFixed(2)}%`);
                } else {
                    alert(`Quiz submitted!\nScore: ${correct}/${total}\nPercentage: ${percentage.toFixed(2)}%`);
                }
            });
        },
        addQuestion() {
            if (!this.isAdmin) return;
            this.questionData.quiz_id = this.$route.params.id;
            fetch('/api/createquestion', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.questionData)
            })
            .then(response => response.json())
            .then(() => {
                this.loadQuestions();
                const modal = window.bootstrap && window.bootstrap.Modal.getInstance(document.getElementById('addquestion'));
                if (modal) modal.hide();
                this.resetQuestionForm();
            });
        },
        updateQuestion() {
            if (!this.isAdmin) return;
            fetch(`/api/updatequestion/${this.questionData.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.questionData)
            })
            .then(response => response.json())
            .then(() => {
                this.loadQuestions();
                const modal = window.bootstrap && window.bootstrap.Modal.getInstance(document.getElementById('updatequestion'));
                if (modal) modal.hide();
                this.resetQuestionForm();
            });
        },
        deleteQuestion(id) {
            if (!this.isAdmin) return;
            fetch(`/api/deletequestion/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(() => this.loadQuestions());
        },
        editQuestion(question) {
            if (!this.isAdmin) return;
            this.questionData = { ...question, quiz_id: this.$route.params.id };
            this.isEditing = true;
        },
        resetQuestionForm() {
            this.questionData = {
                id: "",
                statement: "",
                correct: "",
                optiona: "",
                optionb: "",
                optionc: "",
                optiond: "",
                quiz_id: this.$route.params.id
            };
            this.isEditing = false;
        }
    }
};