export default {
    template: `
        <div>
            <h4 style="margin: 30px; position: absolute; top: 30px; left: 0px; color: #B19079;">
                Welcome {{userData.username}} (DOB: {{userData.dob}}, Qualification: {{userData.qualification}})
            </h4>
            <div class="container justify-content-end flex-grow-1" style="padding: 20px; margin: 90px 0% 50px 0%; position: relative;">
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5 style="margin: 0;">
                            Quizzes
                            <button v-if="isAdmin" data-bs-toggle="modal" data-bs-target="#addquiz" style="color: #EFEBE0; background-color: #B19079; border: transparent; float: right;">
                                <i class="bi bi-plus-square"></i>
                            </button>
                        </h5>
                    </div>
                    <!-- Add Quiz Modal -->
                    <div class="modal fade" id="addquiz" tabindex="-1" aria-labelledby="addQuizLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                    <h1 class="modal-title fs-5" id="addQuizLabel">Add Quiz</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="addQuiz">
                                        <div class="mb-3">
                                            <label for="name" class="col-form-label" style="color: #B19079;">Quiz Name:</label>
                                            <input v-model="quizData.name" type="text" class="form-control" id="name" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                        </div>
                                        <div class="mb-3">
                                            <label for="quiz_date" class="col-form-label" style="color: #B19079;">Quiz Date:</label>
                                            <input v-model="quizData.quiz_date" type="date" class="form-control" id="quiz_date" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                        </div>
                                        <div class="mb-3">
                                            <label for="time" class="col-form-label" style="color: #B19079;">Quiz Time (minutes):</label>
                                            <input v-model.number="quizData.time" type="number" min="1" class="form-control" id="time" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                        </div>
                                        <div class="mb-3">
                                            <label for="remarks" class="col-form-label" style="color: #B19079;">Remarks:</label>
                                            <textarea v-model="quizData.remarks" class="form-control" id="remarks" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;"></textarea>
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
                    <div class="card-body">
                        <div id="quizzesCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                <div v-for="(quiz, index) in quizzes" :class="['carousel-item', { active: index === 0 }]" :key="quiz.id">
                                    <div style="padding: 20px; text-align: center; color: #B19079;">
                                        <h4>{{ quiz.name }}</h4>
                                        <p>{{ quiz.quiz_date }}</p>
                                        <p>Time: {{ quiz.time }} min</p>
                                        <p>{{ quiz.remarks }}</p>
                                        <p v-if="isAdmin">
                                            <span>
                                                <button data-bs-toggle="modal" data-bs-target="#updatequiz" class="btn" style="color: #B19079;" @click="editQuiz(quiz)">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button class="btn" style="color: #B19079;" @click="deleteQuiz(quiz.id)">
                                                    <i class="bi bi-trash3"></i>
                                                </button>
                                            </span>
                                        </p>
                                        <router-link :to="{name:'question', params:{id:quiz.id}}" v-if="isAdmin" class="btn" style="color: #B19079;">Go to questions <i class="bi bi-arrow-right"></i></router-link>
                                        <router-link :to="{name:'question', params:{id:quiz.id}}" v-else class="btn" style="color: #B19079;">Attempt Quiz <i class="bi bi-arrow-right"></i></router-link>
                                    </div>
                                </div>
                            </div>
                            <!-- Update Quiz Modal -->
                            <div class="modal fade" id="updatequiz" tabindex="-1" aria-labelledby="updateQuizLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                        <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                            <h1 class="modal-title fs-5" id="updateQuizLabel">Update Quiz</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="updateQuiz">
                                                <div class="mb-3">
                                                    <label for="name" class="col-form-label" style="color: #B19079;">Quiz Name:</label>
                                                    <input v-model="quizData.name" type="text" class="form-control" id="name" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="quiz_date" class="col-form-label" style="color: #B19079;">Quiz date:</label>
                                                    <input v-model="quizData.quiz_date" type="date" class="form-control" id="quiz_date" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="time" class="col-form-label" style="color: #B19079;">Quiz time (minutes):</label>
                                                    <input v-model.number="quizData.time" type="number" min="1" class="form-control" id="time" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="remarks" class="col-form-label" style="color: #B19079;">Remarks:</label>
                                                    <textarea v-model="quizData.remarks" class="form-control" id="remarks" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;"></textarea>
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
                            <!-- Carousel Controls -->
                            <button class="carousel-control-prev" type="button" data-bs-target="#quizzesCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#quizzesCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            userData: "",
            quizzes: [],
            quizData: {
                id: "",
                name: "",
                quiz_date: "",
                time: "",
                remarks: "",
                chapter_id: ""
            },
        };
    },
    computed: {
        isAdmin() {
            return localStorage.getItem('role') === "admin";
        }
    },
    mounted() {
        this.quizData.chapter_id = this.$route.params.id;
        this.loadQuizzes();
        this.loadUserData();
    },
    methods: {
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
        loadQuizzes() {
            fetch(`/api/getquiz/${this.quizData.chapter_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.quizzes = data)
            .catch(error => console.error("Error loading quizzes:", error));
        },
        addQuiz() {
            if (!this.isAdmin) return;
            if (!this.quizData.name || !this.quizData.quiz_date || !this.quizData.time || isNaN(this.quizData.time) || this.quizData.time <= 0) {
                alert("Please fill all fields and enter a valid quiz time (in minutes).");
                return;
            }
            fetch('/api/createquiz', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.quizData)
            })
            .then(response => response.json())
            .then(() => {
                this.loadQuizzes();
                const modal = window.bootstrap && window.bootstrap.Modal.getInstance(document.getElementById('addquiz'));
                if (modal) modal.hide();
                this.quizData = { id: "", name: "", quiz_date: "", time: "", remarks: "", chapter_id: this.quizData.chapter_id };
            });
        },
        updateQuiz() {
            if (!this.isAdmin) return;
            if (!this.quizData.name || !this.quizData.quiz_date || !this.quizData.time || isNaN(this.quizData.time) || this.quizData.time <= 0) {
                alert("Please fill all fields and enter a valid quiz time (in minutes).");
                return;
            }
            fetch(`/api/updatequiz/${this.quizData.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.quizData)
            })
            .then(response => response.json())
            .then(() => {
                this.loadQuizzes();
                const modal = window.bootstrap && window.bootstrap.Modal.getInstance(document.getElementById('updatequiz'));
                if (modal) modal.hide();
                this.quizData = { id: "", name: "", quiz_date: "", time: "", remarks: "", chapter_id: this.quizData.chapter_id };
            });
        },
        deleteQuiz(id) {
            if (!this.isAdmin) return;
            fetch(`/api/deletequiz/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(() => this.loadQuizzes());
        },
        editQuiz(quiz) {
            if (!this.isAdmin) return;
            this.quizData = { ...quiz, chapter_id: this.quizData.chapter_id };
        }
    }
};