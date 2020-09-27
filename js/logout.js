var promise = firebase.auth().signOut();
        promise.then(function(){
            window.location.href='logout.html';
        });