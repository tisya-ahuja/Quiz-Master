export default {
  template: `
  <nav class="navbar fixed-top" style="background-color: #B19079;">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" style="color: #EFEBE0; display: flex; align-items: center;">
        <img src="/static/logo.png" alt="Home page" style="width: 30px; height: 30px; margin-right: 10px;">
      </router-link>
      <ul class="navbar-nav flex-row ms-auto" style="flex-direction: row;">
        <li class="nav-item" style="margin-right: 20px;">
          <router-link to="/" class="nav-link active" aria-current="page" style="color: #EFEBE0;">Home</router-link>
        </li>
        <li class="nav-item" v-if="loggedIn">
          <a href="#" class="nav-link" style="color: #EFEBE0;" @click="logoutUser">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
  `,
  computed: {
    loggedIn() {
      return !!localStorage.getItem('auth_token');
    }
  },
  methods: {
    logoutUser() {
      localStorage.clear();
      this.$router.push('/');
      this.$emit('logout');
    }
  }
};