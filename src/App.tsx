// App.tsx
import { ActorList, ActorForm, DirectorList, DirectorForm } from "./components";

function App() {
    return (
        <div>
            <h1>Фильмотека</h1>

            <h2>Актёры</h2>
            <ActorForm />
            <ActorList />

            <h2>Режиссёры</h2>
            <DirectorForm />
            <DirectorList />
        </div>
    );
}

export default App;