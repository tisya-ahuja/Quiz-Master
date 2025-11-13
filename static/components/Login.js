export default {
  template: `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; background-color: #EFEBE0; color: #B19079; margin: 0; padding: 20px; overflow: hidden; position: fixed; top: 0; left: 0;">
          <div style="text-align: center; width: 100%; max-width: 600px;">
              <h5 style="font-size: 3rem; margin-bottom: 20px;">Login</h5>
              <form class="row g-3">
                  <div class="col-md-6">
                      <label for="email" class="form-label">Email</label>
                      <input 
                          type="email" 
                          class="form-control" 
                          id="email" 
                          v-model="formData.email" 
                          placeholder="Enter your email" 
                          style="background-color: transparent; border: 1px solid #B19079;">
                  </div>
                  <div class="col-md-6">
                      <label for="password" class="form-label">Password</label>
                      <input 
                          type="password" 
                          class="form-control" 
                          id="password" 
                          v-model="formData.password" 
                          placeholder="Enter your password" 
                          style="background-color: transparent; border: 1px solid #B19079;">
                  </div>
                  <div class="col-12">
                      <button 
                          @click="loginUser" 
                          class="btn" 
                          style="color: #B19079; border: 1px solid #B19079; background-color: transparent; transition: background-color 0.3s, color 0.3s;" 
                          onmouseover="this.style.backgroundColor='#B19079'; this.style.color='#EFEBE0';" 
                          onmouseout="this.style.backgroundColor='transparent'; this.style.color='#B19079';">
                          Sign in
                      </button>
                  </div>
              </form>
          </div>
      </div>
  `,
  data: function() {
    return {
      formData: {
        email: "",
        password: ""
      },
      message: "You are logged in!"
    };
  },
  methods: {
    loginUser: function(event) {
      event.preventDefault();
      fetch('/api/login', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(this.formData)
      })
      .then(response => {
        if (response.ok) {
          return response.json().then(data => {
            localStorage.setItem("auth_token", data["auth-token"]);
            localStorage.setItem("id", data.id);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            if (data.role === "admin") {
              this.$router.push('/admindashboard');
            } else if (data.role === "user") {
              this.$router.push('/dashboard');
            }
            alert(this.message);
          });
        } else {
          return response.json().then(data => {
            if (data.message === "User not found. Redirecting to registration...") {
              alert("User not found. Redirecting to registration...");
              this.$router.push('/register');
            } else {
              alert(data.message);
            }
          });
        }
      });
    }
  }
};