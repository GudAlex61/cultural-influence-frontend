import { useState, type FormEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginArtworkUser, registerArtworkUser } from '../api/artwork-auth';
import { clearArtworkAuthError } from '../store/auth.slice';
import { useArtworkDispatch, useArtworkSelector } from '../store/hooks';

export function ArtworkUserLogin() {
  const dispatch = useArtworkDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useArtworkSelector((s) => s.auth);
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  if (user) return <Navigate to="/artwork_excerpts" replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = register
      ? await registerArtworkUser({ username, displayName, password }, dispatch)
      : await loginArtworkUser({ username, password }, dispatch);
    if (success) { setPassword(''); navigate('/artwork_excerpts', { replace: true }); }
  }
  return <section className="artwork-form-page">
    <p className="artwork-eyebrow">КУЛЬТУРНЫЙ СЛЕД</p>
    <h1>{register ? 'Регистрация' : 'Вход'}</h1>
    <p>Войдите, чтобы публиковать отрывки и отмечать понравившиеся произведения.</p>
    {error && <Alert variant="danger">{error}</Alert>}
    <Form onSubmit={submit}><fieldset disabled={loading}>
      <Form.Group className="mb-3" controlId="artwork-username">
        <Form.Label>Логин</Form.Label>
        <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} required
          minLength={register ? 3 : 1} maxLength={64} autoComplete="username"
          pattern={register ? '[a-zA-Z][a-zA-Z0-9_]*' : undefined} />
      </Form.Group>
      {register && <Form.Group className="mb-3" controlId="artwork-display-name">
        <Form.Label>Имя</Form.Label>
        <Form.Control value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={100} autoComplete="name" />
      </Form.Group>}
      <Form.Group className="mb-3" controlId="artwork-password">
        <Form.Label>Пароль</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          required minLength={register ? 8 : 1} maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} />
      </Form.Group>
      <Button type="submit">{register ? 'Зарегистрироваться' : 'Войти'}</Button>
      <Button className="ms-2" variant="outline-secondary" type="button" onClick={() => {
        setRegister(!register); dispatch(clearArtworkAuthError());
      }}>{register ? 'Уже есть аккаунт' : 'Создать аккаунт'}</Button>
    </fieldset></Form>
  </section>;
}
