export default {
    template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; background-color: #EFEBE0; color: #B19079; margin: 0; padding: 20px; overflow: hidden; position: fixed; top: 0; left: 0;">
        <div style="text-align: center; width: 100%; max-width: 600px;">
            <h5 style="font-size: 3rem; margin-bottom: 20px;">Register</h5>
            <form class="row g-3">
                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Enter your email"style="background-color: transparent; border: 1px solid #B19079;">
                </div>
                <div class="col-md-6">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" v-model="formData.password" placeholder="Enter your password"style="background-color: transparent; border: 1px solid #B19079;">
                </div>
                <div class="col-12">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" v-model="formData.username" placeholder="John Doe"style="background-color: transparent; border: 1px solid #B19079;">
                </div>
                <div class="col-md-6">
                    <label for="qualification" class="form-label">Qualification</label>
                    <input type="text" class="form-control" id="qualification" v-model="formData.qualification" placeholder="Enter your qualification"style="background-color: transparent; border: 1px solid #B19079;">
                </div>
                <div class="col-md-6">
                    <label for="dob" class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="dob" v-model="formData.dob" style="background-color: transparent; border: 1px solid #B19079;">
                </div>
                <div class="col-12">
                    <button @click="addUser" class="btn" style="color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;" 
                        onmouseover="this.style.backgroundColor='#B19079'; this.style.color='#EFEBE0';" 
                        onmouseout="this.style.backgroundColor='transparent'; this.style.color='#B19079';">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    </div>
    `,
    data: function(){
        return{
            formData:{
                email:"",
                password:"",
                username:"",
                qualification:"",
                dob:""
            }
        }
      },
      methods:{
        addUser:function(){
            fetch('/api/register', {
                method: 'POST',
                headers:{
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                this.$router.push('/login')
            })
        }
      }
};