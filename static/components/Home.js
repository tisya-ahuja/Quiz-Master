export default {
    template: `
        <div style="display: flex; justify-content: space-between; align-items: center; height: 100vh; width: 100vw; background-color: #EFEBE0; color: #B19079; margin: 0; padding: 20px; overflow: hidden; position: fixed; top: 0; left: 0;">
            <div style="text-align: left; max-width: 50%;">
                <h1 style="font-size: 4rem; margin-bottom: 10px;">QuizMaster</h1>
                <p style="font-size: 1.5rem; margin: 0;">Test your knowledge and skills with our quizzes!</p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 20px; max-width: 40%;">
                <p style="margin: 0; font-size: 1.2rem;">Have an account? 
                    <router-link to="/login" style="text-decoration: none; color: #B19079; font-weight: bold;">Sign in</router-link>
                </p>
                <p style="margin: 0; font-size: 1.2rem;">Create an account  
                    <router-link to="/register" style="text-decoration: none; color: #B19079; font-weight: bold;">Sign up</router-link>
                </p>
            </div>
        </div>
    `
};