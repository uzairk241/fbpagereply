// // Set up your Facebook Page access token
// const pageAccessToken = 'EAANlDKVqH2wBO1DP7i0tzUVkQKMhTx8c95KTidQ25Cqw64YhmDlNq64JChP9ewonNDJoeLgS13FwTAPjHRoTZBCoS5Xf9gnysUZB0YomWE4wUhE6ZBxdjzlsfYfLNZBrF4MhzA3Kyhg0foyIoIzZAD60HHAV0vnEH1n00HVt4mThAbP2O01ZCdxnKdEA5FFRDaxObJdf34HFCmx69S3n07ZB2QZD';

// // Define the comment keyword
// const keyword = 'invest';

// // Define the reply text
// const replyText = 'Thank you for your interest in investing! Please feel free to reach out to us for more information.';

// // Make a GET request to fetch all posts on the page
// fetch(`https://graph.facebook.com/v12.0/217676104770344/posts?fields=id&access_token=${pageAccessToken}`)
//     .then(response => response.json())
//     .then(posts => {
//         posts.data.forEach(post => {
//             // For each post, fetch its comments
//             fetch(`https://graph.facebook.com/v12.0/${post.id}/comments?access_token=${pageAccessToken}`)
//                 .then(response => response.json())
//                 .then(comments => {
//                     comments.data.forEach(comment => {
//                         // Check each comment for the keyword and reply if found
//                         if (comment.message && comment.message.includes(keyword)) {
//                             // Make a POST request to reply to the comment
//                             fetch(`https://graph.facebook.com/v12.0/${comment.id}/comments?access_token=${pageAccessToken}`, {
//                                 method: 'POST',
//                                 headers: {
//                                     'Content-Type': 'application/json'
//                                 },
//                                 body: JSON.stringify({ message: replyText })
//                             });
//                         }
//                     });
//                 });
//         });
//     });
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

// Use body-parser middleware to parse incoming JSON
app.use(bodyParser.json());

// Set up your Facebook Page access token and Page ID
const pageAccessToken = 'EAANlDKVqH2wBO1DP7i0tzUVkQKMhTx8c95KTidQ25Cqw64YhmDlNq64JChP9ewonNDJoeLgS13FwTAPjHRoTZBCoS5Xf9gnysUZB0YomWE4wUhE6ZBxdjzlsfYfLNZBrF4MhzA3Kyhg0foyIoIzZAD60HHAV0vnEH1n00HVt4mThAbP2O01ZCdxnKdEA5FFRDaxObJdf34HFCmx69S3n07ZB2QZD';
const pageId = '217676104770344'; // Replace YOUR_PAGE_ID with your actual Page ID

// Define the comment keyword
const keyword = 'invest';

// Define the reply text
const replyText = 'Thank you for your interest in investing! Please feel free to reach out to us for more information.';

app.get('/', (req, res) => {
    res.send('1980208162');
});

// Define the endpoint for receiving webhook events
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page' && body.entry) {
        body.entry.forEach(entry => {
            if (entry.changes) {
                entry.changes.forEach(change => {
                    if (change.field === 'feed' && change.value.item === 'comment' && change.value.message && change.value.message.includes(keyword)) {
                        // Send a reply back to the user
                        sendReply(change.value.post_id, change.value.comment_id, replyText);
                    }
                });
            }
        });
    }

    // Return a 200 OK response
    res.status(200).send('EVENT_RECEIVED');
});

// Function to send a reply back to the user
function sendReply(postId, commentId, message) {
    // Make a POST request to send a reply message
    axios.post(`https://graph.facebook.com/${pageId}_${commentId}/comments?access_token=${pageAccessToken}`, {
        message: message,
    })
    .then(response => {
        if (response.data.id) {
            console.log('Reply sent to comment ID:', commentId, 'Message:', message);
        } else {
            console.error('Failed to send reply:', response.data);
        }
    })
    .catch(error => {
        console.error('Error sending reply:', error);
    });
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
