app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Username & password tetap
    if (username === 'admin' && password === '12345') {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: 'Username atau password salah!' });
    }
  })