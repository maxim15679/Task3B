import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

function whatIsIt(data) {
  const reg = new RegExp('[^0-9]');
  if (data.search(reg) === -1) { return 'id'; }
  return 'username';
}
const app = express();
app.use(cors());

// Get model
  let petsxf = {};
  const petsUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';
  fetch(petsUrl)
  .then(async (res) => {
    petsxf = await res.json();
     console.log(pets);
  })
.catch(err => {
});

function getModel() {
  return petsxf;
}


// Done
// Routes
app.get('/', (req, res) => {
  const pets = Object.assign({}, petsxf);
  res.json(pets);
});

app.get('/users/:data/populate', (req, res) => {
  const pets = new getModel();
  const data = req.params.data;
  const type = whatIsIt(data);
  if (type === 'id') {
    const id = parseInt(data, 10);
    if (!id) {
      return res.status(404).send('Not Found');
    }
  // id = parseInt(id, 10);
    const users = pets.users;
    let found = false;
    const result = [];
    users.forEach((item) => {
      if (item.id === id) {
        found = true;
        const itemClone = Object.assign({}, item);
        const ps = [];
        const p12 = pets.pets;
        p12.forEach((p) => {
          if (p.userId === id) { ps.push(p); }
        });
        itemClone.pets = ps;
        res.json(itemClone);
      }
    });
    if (!found) { return res.status(404).send('Not Found'); }
  } else if (type === 'username') {
    const username = data;
    const users = pets.users;
    let found = false;
    users.forEach((item) => {
      if (item.username === username) {
        found = true;
        const itemClone = Object.assign({}, item);
        const ps = [];
        const p12 = pets.pets;
        p12.forEach((p) => {
          if (p.userId === item.id) { ps.push(p); }
        });
        itemClone.pets = ps;
        res.json(itemClone);
      }
    });
    if (!found) { return res.status(404).send('Not Found'); }
  }
});

app.get('/users/populate', (req, res) => {
  const pets = Object.assign({}, petsxf);
  if (!req.query.havePet) {
    const result = [];
    const us0876 = pets.users;
    us0876.forEach((user0) => {
      const itemClone = Object.assign({}, user0);
      const ps1 = [];
      pets.pets.forEach((p) => {
        if (p.userId === user0.id) { ps1.push(p); }
      });
      itemClone.pets = ps1;
      result.push(itemClone);
    });
    return res.json(result);
  }
  const result = [];
  let ps = [];
  const us12 = pets.users;
  us12.forEach((user) => {
    ps = [];
    const itemClone = Object.assign({}, user);
    const ps12 = pets.pets;
    let found = false;
    ps12.forEach((p) => {
      if (p.userId === user.id && p.type === req.query.havePet) {
        found = true;
        return true;
      }
    });
    if (found) {
      ps12.forEach((z) => {
        if (z.userId === user.id) { ps.push(z); }
      });
    }
    if (ps.length > 0) {
      itemClone.pets = ps;
      result.push(itemClone);
    }
  });
  console.log(result);
  return res.send(result);
});

app.get('/pets/:id/populate', (req, res) => {
  const pets = new getModel();
  const type = whatIsIt(req.params.id);
  if (!req.params.id || type !== 'id') { return res.status(404).send('Not Found'); }
  const id = parseInt(req.params.id, 10);
  let found = false;
  const p12 = pets.pets;
  p12.forEach((item) => {
    if (item.id === id) {
      found = true;
      const itemClone = Object.assign({}, item);
      const u12 = pets.users;
      u12.forEach((u) => {
        if (u.id === item.userId) { itemClone.user = u; return true; }
      });
      return res.json(itemClone);
    }
  });
  if (!found) { return res.status(404).send('Not Found'); }
  return true;
});


app.get('/pets/populate', (req, res) => {
  const pets = new getModel();
  if (!req.query.type && !req.query.age_gt && !req.query.age_lt) {
    const result = [];
    const p13 = pets.pets;
    p13.forEach((item) => {
      const itemClone = Object.assign({}, item);
      const u13 = pets.users;
      u13.forEach((u) => {
        if (u.id === item.userId) { itemClone.user = u; }
      });
      result.push(itemClone);
    });
    res.json(result);
  } else if (req.query.type || req.query.age_gt || req.query.age_lt) {
    let typeCriteria = false;
    let olderCriteria = false;
    let youngerCriteria = false;
    let type = '';
    let older = '';
    let younger = '';
    if (req.query.type) { type = req.query.type; typeCriteria = true; }
    if (req.query.age_gt) { older = req.query.age_gt; olderCriteria = true; }
    if (req.query.age_lt) { younger = req.query.age_lt; youngerCriteria = true; }
    const p14 = pets.pets;
    const result = [];
    p14.forEach((item) => {
      let typeOK = false;
      let olderOK = false;
      let youngerOK = false;
      if (!typeCriteria) { typeOK = true; } else if (item.type === type) { typeOK = true; }
      if (!olderCriteria) { olderOK = true; } else if (item.age > older) { olderOK = true; }
      if (!youngerCriteria) { youngerOK = true; } else if (item.age < younger) { youngerOK = true; }
      if (typeOK && olderOK && youngerOK) {
        const itemClone = Object.assign({}, item);
        const pu1 = pets.users;
        pu1.forEach((u) => {
          if (u.id === item.userId) { itemClone.user = u; return true; }
        });
        result.push(itemClone);
      }
    });
    console.log(result.length);
    // if (result.length < 1) { return res.status(404).send('Not Found'); }
    return res.json(result);
  }
  return true;
});

app.get('/users', (req, res) => {
  const pets = new getModel();
  if (!req.query.havePet) {
    return res.json(pets.users);
  }
  const reqPet = req.query.havePet;
  let result = [];
  let found = false;
  const us2 = pets.users;
  us2.forEach((item) => {
    let added = false;
    const uid = item.id;
    const up2 = pets.pets;
    up2.forEach((p) => {
      if (p.userId === uid && p.type === reqPet && !added) {
        result.push(item); found = true; added = true;
        return true;
      }
    });
  });
  // if (!found) { return res.status(404).send('Not Found'); }
  res.json(result);
  console.log(req.query);
});

app.get('/pets', (req, res) => {
  const pets = new getModel();
  if (!req.query.type && !req.query.age_gt && !req.query.age_lt) {
    return res.json(pets.pets);
  } else if (req.query.type || req.query.age_gt || req.query.age_lt) {
    let typeCriteria = false;
    let olderCriteria = false;
    let youngerCriteria = false;
    let type = '';
    let older = '';
    let younger = '';
    if (req.query.type) { type = req.query.type; typeCriteria = true; }
    if (req.query.age_gt) { older = req.query.age_gt; olderCriteria = true; }
    if (req.query.age_lt) { younger = req.query.age_lt; youngerCriteria = true; }
    const pet78 = pets.pets;
    const result = [];
    pet78.forEach((item) => {
      let typeOK = false;
      let olderOK = false;
      let youngerOK = false;
      if (!typeCriteria) { typeOK = true; } else if (item.type === type) { typeOK = true; }
      if (!olderCriteria) { olderOK = true; } else if (item.age > older) { olderOK = true; }
      if (!youngerCriteria) { youngerOK = true; } else if (item.age < younger) { youngerOK = true; }
      if (typeOK && olderOK && youngerOK) { result.push(item); }
    });
    console.log(result.length);
    // if (result.length < 1) { return res.status(404).send('Not Found'); }
    return res.json(result);
  }
  return true;
});

app.get('/pets/:id', (req, res) => {
  const pets = new getModel();
  const type = whatIsIt(req.params.id);
  if (!req.params.id || type !== 'id') { return res.status(404).send('Not Found'); }
  const id = parseInt(req.params.id, 10);
  let found = false;
  const p79 = pets.pets;
  p79.forEach((item) => {
    if (item.id === id) { found = true; return res.json(item); }
  });
  if (!found) { return res.status(404).send('Not Found'); }
  return true;
});

app.get('/users/:data', (req, res) => {
  const pets = new getModel();
  const data = req.params.data;
  const type = whatIsIt(data);
  if (type === 'id') {
    const id = parseInt(data, 10);
    if (!id) {
      return res.status(404).send('Not Found');
    }
  // id = parseInt(id, 10);
    const users67 = pets.users;
    let found = false;
    users67.forEach((item) => {
      if (item.id === id) { res.json(item); found = true; }
    });
    if (!found) { return res.status(404).send('Not Found'); }
  } else if (type === 'username') {
    const username = data;
    const users867 = pets.users;
    let found = false;
    users867.forEach((item) => {
      if (item.username === username) { res.json(item); found = true; }
    });
    if (!found) { return res.status(404).send('Not Found'); }
  }
});

app.get('/users/:data/pets', (req, res) => {
  const pets = new getModel();
  const data = req.params.data;
  const type = whatIsIt(data);
  const pet321 = pets.pets;
  if (type === 'id') {
    const id = parseInt(data, 10);
    let found = false;
    let result = [];
    pet321.forEach((item) => {
      if (item.userId === id) { result.push(item); found = true; }
    });
    if (!found) { return res.status(404).send('Not Found'); }
    res.json(result);
  } else if (type === 'username') {
    const username = data;
    let id = 0;
    let found = false;
    console.log('Search id');
    const users09 = pets.users;
    users09.forEach((item) => {
      if (item.username === username) { id = item.id; found = true; }
    });
    if (!found) { return res.status(404).send('Not Found'); }
    found = false;
    let result = [];
    const pfx56 = pets.pets;
    pfx56.forEach((item) => {
      if (item.userId === id) { result.push(item); found = true; }
    });
    if (!found) { return res.status(404).send('Not Found'); }
    res.json(result);
  }
});


// Listen port 3000
app.listen(3000, () => {
  console.log('[INFO] Example app listening on port 3000!');
});
