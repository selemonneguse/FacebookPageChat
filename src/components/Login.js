import { useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showPageSelection, setShowPageSelection] = useState(false);
  const navigate = useNavigate();

  // בדיקה אם כבר יש session קיים
  useEffect(() => {
    fetch('https://localhost:8443/chat/facebook/check-session', {
      method: 'GET',
      credentials: 'include', // 👈 חשוב מאוד! מאפשר שליחת קוקיז
    })
      .then(async res => {
        if (res.ok) {
          // אם יש session - ננווט ישר לעמוד הראשי
          navigate('/chat');
        }
      })
      .catch(err => {
        console.error("Error checking session:", err);
      });
  }, [navigate]);

  const responseFacebook = response => {
    console.log("response: ", response);
    const userAccessToken = response.accessToken;

    if (!userAccessToken) {
      console.warn('No accessToken available');
      return;
    }

    const userData = {
      name: response.name,
      id: response.id,
      avatar: response.picture.data.url,
      accessToken: userAccessToken,
    };

    console.log('User Data:', userData);

    // קבלת עמודי פייסבוק של המשתמש
    fetch(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}&fields=name,id,access_token`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          console.log('User Pages:', data.data);
          
          // שמירת העמודים במצב הקומפוננטה
          setPages(data.data);
          setShowPageSelection(true);
        } else {
          console.log('No pages found or error:', data);
        }
      })
      .catch(err => {
        console.error('Error fetching pages:', err);
      });
  };

  const handlePageSelection = (page) => {
    const payload = {
      pageId: page.id,
      pageAccessToken: page.access_token,
    };

    console.log('Sending to server:', payload);

    // שלח לשרת שלך את המידע הזה
    fetch('https://localhost:8443/chat/facebook/page-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    .then(serverResponse => {
      navigate("/chat");
    })
    .catch(err => {
      console.error('Error sending page data to server:', err);
    });
  };

  
  const componentClicked = data => {
    
    console.log("call back data: ", data);
  }

  return (
    <div className="container-fluid bg-dark text-light vh-100 d-flex flex-column justify-content-end align-items-center p-3">
      
      {/* אזור בחירת עמוד */}
      {showPageSelection ? (
        <div className="mb-4 w-100 d-flex flex-column align-items-center">
          <h3 className="mb-3 text-center">בחר עמוד פייסבוק</h3>
          <div className="row w-100 justify-content-center">
            {pages.map(page => (
              <div key={page.id} className="col-12 col-md-6 col-lg-4 mb-3">
                <div 
                  className="card bg-secondary text-light h-100 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePageSelection(page)}
                >
                  <div className="card-body text-center">
                    <h5 className="card-title">{page.name}</h5>
                    <p className="card-text">ID: {page.id}</p>
                    <button className="btn btn-primary">בחר עמוד זה</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : 
        (<div className="alert alert-info text-center w-100">
          כדי להמשיך, יש ללחוץ על כפתור ההתחברות לפייסבוק ולאחר מכן לבחור עמוד פייסבוק מהרשימה שתופיע.
        </div>)
      }

      <FacebookLogin
        appId="1327044148622457"
        autoLoad={true}
        fields="name,email,picture"
        scope="public_profile,pages_show_list,pages_read_engagement,pages_manage_posts"
        onClick={componentClicked}
        callback={responseFacebook} 
      />
    </div>
  );
}
