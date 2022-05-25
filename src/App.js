import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { database, signInWithGoogle } from "./Firebase";
import { ref, child, onValue, push, set } from "firebase/database";
import { Button, Form, Nav, Navbar, Container, Breadcrumb, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [ID, setID] = useState("vrintle");
  const [type, setType] = useState(2);
  const [cID, setCID] = useState(291);
  const [page, setPage] = useState(0);
  const [ranklistURL, setRanklistURL] = useState('');
  const [loading, setLoading] = useState(0);
  const urls = ['biweekly', 'weekly']
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  });

  const handleAuth = () => {
    signInWithGoogle().then(result => {
      console.log(result.user);
      setUser(result.user);
      sessionStorage.setItem('user', JSON.stringify(result.user));
      let userRef = ref(database, 'users'), idRef = child(userRef, result.user.uid);
      set(idRef, JSON.stringify(result.user));
    }).catch(error => {
      console.log(error);
    })
  }

  const getRank = () => {
    if(type < 1 || type > 2) return ;
    setLoading(1);
    setPage(0);
    console.log(ID, cID, type, urls[type]);
    let contest = `${urls[type - 1]}-contest-${cID}`;
    let contestRef = ref(database, contest), userRef = child(contestRef, ID);
    onValue(userRef, ss => {
      console.log("ss info: ", ss.key, ss.val())
      ss.forEach(snap => {
        console.log("snap info: ", snap.key, snap.ref, snap.val());
        setPage(snap.val());
      })
      setTimeout(() => {
        setLoading(0)
      }, 200)
    })
  }

  useEffect(() => {
    setRanklistURL(getURL())
  }, [page])

  const getURL = () => {
    let contest = `${urls[type - 1]}-contest-${cID}`;
    return `https://leetcode.com/contest/${contest}/ranking/${page}/`;
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className='sticky-top p-0'>
        <Container>
          <Navbar.Brand href="/" className='p-0'>
            <img
              alt="logo"
              src={require("./logo.svg").default}
              width="36"
              height="36"
              className="d-inline-block align-top"
              style={{marginTop: '7px'}}
            />&nbsp;
            <Breadcrumb className="Crumb p-0">
              <Breadcrumb.Item href="https://www.linkedin.com/in/vrintle/" className='Crumb-Link'>
                vrintle
              </Breadcrumb.Item>
              <Breadcrumb.Item href="https://github.com/vrintle" className='Crumb-Link'>
                github
              </Breadcrumb.Item>
              <Breadcrumb.Item active>leetcode-contest-ranks</Breadcrumb.Item>
            </Breadcrumb>
          </Navbar.Brand>
          {
            user ? (
              <a style={{fontSize: "20px", fontFamily: "MS"}} title="To SignOut, just close the Application tab.">Hi, {user.displayName} !</a>
            ) : (
              <button class="btn btn-outline-primary me-2" onClick={handleAuth} >
                Sign In
              </button>
            )
          }
        </Container>
      </Navbar>
      <br />
      <Form className="Form">
        {
          user ? (
          <fieldset disabled={loading || !user}>
            <Form.Group className="mb-3">
              <Form.Label>LeetCode ID</Form.Label>
              <Form.Control type="text" value={ID} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Enter LeetCode ID of User.." onChange={evt => setID(evt.target.value)} />
              <Form.Text className="text-muted">
                For example: vrintle
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contest ID</Form.Label>
              <Form.Control type="number" value={cID} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Enter Contest Number.." onChange={evt => setCID(evt.target.value)} />
              <Form.Text className="text-muted">
                For example: 101
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select the type of LeetCode Contest</Form.Label>
              <Form.Select value={type} onChange={evt => setType(evt.target.value)}>
                <option value={1}>Biweekly</option>
                <option value={2}>Weekly</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" onClick={getRank}>
            { loading ? "Loading..." : "Submit" }
            </Button>
          </fieldset> ) : (
            <></>
          )
        }
        <br />
        <Alert variant="success" className='Alert'>
          <Alert.Heading  style={{fontFamily: "MS", fontSize: "32px"}}>Hey!</Alert.Heading>
          <hr />
          <p className="m-0">
            {
              !user ? (
                <div>SignIn is required to use the App.</div>
              ) : page ? (
                <div>User has been found in the <a href={ranklistURL} target="_blank">contest ranklist</a>, go check it out !</div>
              ) : loading ? (
                <div>Please wait, We are working on it...</div>
              ) : (
                <div>User hasn't participated in the given contest...</div>
              )
            }
          </p>
        </Alert>
      </Form>
    </div>
  );
}

export default App;
