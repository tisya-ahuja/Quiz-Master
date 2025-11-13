export default {
    template: `
        <div>
            <h4 style="margin: 30px; position: absolute; top: 30px; left: 0px; color: #B19079;">
                Welcome {{userData.username}} (DOB: {{userData.dob}}, Qualification: {{userData.qualification}})
            </h4>
            <div class="container justify-content-end flex-grow-1" style="padding: 20px; margin: 90px 0% 50px 0%; position: relative;">
                <!-- Chapters Section -->
                <div class="card mb-4" style="border: 1px solid #B19079; border-radius: 10px; background-color: #EFEBE0;">
                    <div class="card-header" style="background-color: #B19079; color: #EFEBE0;">
                        <h5 style="margin: 0;">
                            Chapters
                            <!-- Show Add button only for admin -->
                            <button v-if="isAdmin" data-bs-toggle="modal" data-bs-target="#addchapter" style="color: #EFEBE0; background-color: #B19079; border: transparent; float: right;">
                                <i class="bi bi-plus-square"></i>
                            </button>
                        </h5>
                    </div>
                    <div class="modal fade" id="addchapter" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add Chapter</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="mb-3">
                                            <label for="name" class="col-form-label" style="color: #B19079;">Chapter Name:</label>
                                            <input v-model="chapterData.name" type="text" class="form-control" id="name" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                        </div>
                                        <div class="mb-3">
                                            <label for="description" class="col-form-label" style="color: #B19079;">Description:</label>
                                            <textarea v-model="chapterData.description" class="form-control" id="description" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;"></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer" style="background-color: #EFEBE0;">
                                    <button @click="addChapter" class="btn" data-bs-dismiss="modal" style="color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;" 
                                        onmouseover="this.style.backgroundColor='#B19079'; this.style.color='#EFEBE0';" 
                                        onmouseout="this.style.backgroundColor='transparent'; this.style.color='#B19079';">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="chaptersCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                <div v-for="(chapter, index) in chapters" :class="['carousel-item', { active: index === 0 }]" :key="chapter.id">
                                    <div style="padding: 20px; text-align: center; color: #B19079;">
                                        <h4>{{ chapter.name }}</h4>
                                        <p>{{ chapter.description }}</p>
                                        <p v-if="isAdmin">
                                            <span>
                                                <button data-bs-toggle="modal" data-bs-target="#updatechapter" class="btn" style="color: #B19079;" @click="editChapter(chapter)">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button class="btn" style="color: #B19079;" @click="deleteChapter(chapter.id)">
                                                    <i class="bi bi-trash3"></i>
                                                </button>
                                            </span>
                                        </p>
                                        <router-link :to="{name:'quiz', params:{id:chapter.id}}" class="btn" style="color: #B19079;">Go to quiz <i class="bi bi-arrow-right"></i></router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="updatechapter" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content" style="background-color: #EFEBE0; border: 1px solid #B19079;">
                                        <div class="modal-header" style="background-color: #B19079; color: #EFEBE0;">
                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Chapter</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="background-color: #EFEBE0;"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form>
                                                <div class="mb-3">
                                                    <label for="name" class="col-form-label" style="color: #B19079;">Chapter Name:</label>
                                                    <input v-model="chapterData.name" type="text" class="form-control" id="name" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="description" class="col-form-label" style="color: #B19079;">Description:</label>
                                                    <textarea v-model="chapterData.description" class="form-control" id="description" style="background-color: transparent; border: 1px solid #B19079; color: #B19079;"></textarea>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer" style="background-color: #EFEBE0;">
                                            <button @click="updateChapter" class="btn" data-bs-dismiss="modal" style="color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;" 
                                                onmouseover="this.style.backgroundColor='#B19079'; this.style.color='#EFEBE0';" 
                                                onmouseout="this.style.backgroundColor='transparent'; this.style.color='#B19079';">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Carousel Controls -->
                            <button class="carousel-control-prev" type="button" data-bs-target="#chaptersCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#chaptersCarousel" data-bs-slide="next">
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
            chapters: [],
            chapterData: {
                id: "",
                name: "",
                description: "",
                subject_id: ""
            },
        };
    },
    computed: {
        isAdmin() {
            return localStorage.getItem('role') === "admin";
        }
    },
    mounted() {
        this.chapterData.subject_id = this.$route.params.id;
        this.loadChapters();
        this.loadUserData();
    },
    methods: {
        loadUserData() {
            if (this.isAdmin)
                fetch('/api/admin', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                })
                .then(response => response.json())
                .then(data => this.userData = data)
                .catch(error => console.error("Error loading user data:", error));

            else
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
        loadChapters() {
            fetch(`/api/getchapter/${this.chapterData.subject_id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => this.chapters = data)
            .catch(error => console.error("Error loading chapters:", error));
        },
        addChapter() {
            if (!this.isAdmin) return;
            fetch('/api/createchapter', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.chapterData)
            })
            .then(response => response.json())
            .then(() => this.loadChapters());
        },
        updateChapter() {
            if (!this.isAdmin) return;
            fetch(`/api/updatechapter/${this.chapterData.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.chapterData)
            })
            .then(response => response.json())
            .then(() => this.loadChapters());
        },
        deleteChapter(id) {
            if (!this.isAdmin) return;
            fetch(`/api/deletechapter/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(() => this.loadChapters());
        },
        editChapter(chapter) {
            if (!this.isAdmin) return;
            this.chapterData = { ...chapter };
        }
    }
};