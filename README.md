# Buddy Career

## How to Run
first type in `npm run-script build`
then run server with `node server`


## Functions

<dl>
<dt><a href="#getCollegeList">getCollegeList(search)</a> ⇒</dt>
<dd><p>Used for applying mentor</p>
</dd>
<dt><a href="#addCollege">addCollege(college_name)</a> ⇒</dt>
<dd><p>add college to the college table</p>
</dd>
<dt><a href="#createMentorComment">createMentorComment(mid:, text:, uid:)</a></dt>
<dd><p>Create comment for a given mentor</p>
</dd>
<dt><a href="#createCommentLike">createCommentLike(comment_id:, uid:)</a></dt>
<dd><p>The uid-comment_id comment ID relation is maintained by a table
to prevent one user click like multiple times</p>
</dd>
<dt><a href="#createMentorReply">createMentorReply(comment_id:, reply:)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd></dd>
<dt><a href="#sendActivationEmail">sendActivationEmail(email:, link:)</a></dt>
<dd></dd>
<dt><a href="#sendPasswordResetEmail">sendPasswordResetEmail(email:, newPassword:)</a></dt>
<dd></dd>
<dt><a href="#sendMessageEmail">sendMessageEmail(email:, message:)</a></dt>
<dd></dd>
<dt><a href="#getMajorList">getMajorList()</a> ⇒</dt>
<dd></dd>
<dt><a href="#getUserByUID">getUserByUID(uid)</a> ⇒</dt>
<dd></dd>
<dt><a href="#getUserByEmailAndUnhashedPassword">getUserByEmailAndUnhashedPassword(email, password)</a> ⇒</dt>
<dd><p>This method is used to verify user information on log in</p>
</dd>
<dt><a href="#getUserHelper">getUserHelper(whereClause, values)</a> ⇒</dt>
<dd><p>A helper method used to get user information by passing the constraints</p>
</dd>
<dt><a href="#getUserIDByEmail">getUserIDByEmail(email)</a> ⇒</dt>
<dd><p>This method is used when the user forget the password</p>
</dd>
<dt><a href="#getUserIDByAccessToken">getUserIDByAccessToken(access_token)</a> ⇒</dt>
<dd><p>This method is used to convert access token to user id</p>
</dd>
<dt><a href="#getUserIDHelper">getUserIDHelper(whereClause, values)</a> ⇒</dt>
<dd><p>A helper method used to get user id by passing the constraints</p>
</dd>
<dt><a href="#updateUserAttribute">updateUserAttribute(uid, attr, val)</a></dt>
<dd><p>This method is used to update a column for user table</p>
</dd>
<dt><a href="#updateUserWithUnhashedPassword">updateUserWithUnhashedPassword(uid, password)</a></dt>
<dd></dd>
<dt><a href="#updateUserAccessToken">updateUserAccessToken(user:)</a></dt>
<dd><p>This method modify the given user object with new access token</p>
<p>Note that this method take in the entire user object as parameter instead of uid</p>
</dd>
<dt><a href="#createUser">createUser(first, last, password, email)</a> ⇒</dt>
<dd></dd>
<dt><a href="#confirmVerification">confirmVerification(verification_code)</a> ⇒</dt>
<dd></dd>
<dt><a href="#addVerificationCode">addVerificationCode(email, verification_code)</a></dt>
<dd></dd>
<dt><a href="#hashedPassword">hashedPassword(password)</a> ⇒</dt>
<dd><p>Generate hashed password from unhashed password</p>
</dd>
<dt><a href="#sanitizeEmail">sanitizeEmail(email)</a> ⇒</dt>
<dd><p>TODO: we might have to use GDPR standard in the future
It depends on the law in the US.
Since our transactions happen when the customer is physically in US,
This website might have to conform to GDPR standard if U.S. government
decides to endorse GDPR nation-wise.
If this happens, we need to santicize all email in database (hash them)</p>
<p>Now this method only ensures the email to be lower case.</p>
</dd>
</dl>

<a name="getCollegeList"></a>

## getCollegeList(search) ⇒
Used for applying mentor

**Kind**: global function  
**Returns**: up to 20 colleges that matches the search query  

| Param | Description |
| --- | --- |
| search | search query |

<a name="addCollege"></a>

## addCollege(college_name) ⇒
add college to the college table

**Kind**: global function  
**Returns**: the college object with id and name  

| Param |
| --- |
| college_name | 

<a name="createMentorComment"></a>

## createMentorComment(mid:, text:, uid:)
Create comment for a given mentor

**Kind**: global function  

| Param | Description |
| --- | --- |
| mid: | Mentor ID |
| text: | Comment text |
| uid: | User ID |

<a name="createCommentLike"></a>

## createCommentLike(comment_id:, uid:)
The uid-comment_id comment ID relation is maintained by a table
to prevent one user click like multiple times

**Kind**: global function  

| Param | Description |
| --- | --- |
| comment_id: | Comment ID |
| uid: | User ID |

<a name="createMentorReply"></a>

## createMentorReply(comment_id:, reply:) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: global function  

| Param | Description |
| --- | --- |
| comment_id: | Comment ID |
| reply: | Reply text |

<a name="sendActivationEmail"></a>

## sendActivationEmail(email:, link:)
**Kind**: global function  

| Param | Description |
| --- | --- |
| email: | receiver |
| link: | activation link |

<a name="sendPasswordResetEmail"></a>

## sendPasswordResetEmail(email:, newPassword:)
**Kind**: global function  

| Param | Description |
| --- | --- |
| email: | receiver |
| newPassword: | new password generated |

<a name="sendMessageEmail"></a>

## sendMessageEmail(email:, message:)
**Kind**: global function  

| Param | Description |
| --- | --- |
| email: | receiver |
| message: | in-site message |

<a name="getMajorList"></a>

## getMajorList() ⇒
**Kind**: global function  
**Returns**: A list of majors  
<a name="getUserByUID"></a>

## getUserByUID(uid) ⇒
**Kind**: global function  
**Returns**: the user object without password entry  

| Param | Description |
| --- | --- |
| uid | User ID |

<a name="getUserByEmailAndUnhashedPassword"></a>

## getUserByEmailAndUnhashedPassword(email, password) ⇒
This method is used to verify user information on log in

**Kind**: global function  
**Returns**: the user object without password entry  

| Param | Description |
| --- | --- |
| email |  |
| password | UNHASHED password |

<a name="getUserHelper"></a>

## getUserHelper(whereClause, values) ⇒
A helper method used to get user information by passing the constraints

**Kind**: global function  
**Returns**: the user object without password entry  

| Param |
| --- |
| whereClause | 
| values | 

<a name="getUserIDByEmail"></a>

## getUserIDByEmail(email) ⇒
This method is used when the user forget the password

**Kind**: global function  
**Returns**: User ID  

| Param |
| --- |
| email | 

<a name="getUserIDByAccessToken"></a>

## getUserIDByAccessToken(access_token) ⇒
This method is used to convert access token to user id

**Kind**: global function  
**Returns**: user id  

| Param |
| --- |
| access_token | 

<a name="getUserIDHelper"></a>

## getUserIDHelper(whereClause, values) ⇒
A helper method used to get user id by passing the constraints

**Kind**: global function  
**Returns**: user id  

| Param |
| --- |
| whereClause | 
| values | 

<a name="updateUserAttribute"></a>

## updateUserAttribute(uid, attr, val)
This method is used to update a column for user table

**Kind**: global function  

| Param | Description |
| --- | --- |
| uid | user id |
| attr | column in the user table |
| val | value you want to set |

<a name="updateUserWithUnhashedPassword"></a>

## updateUserWithUnhashedPassword(uid, password)
**Kind**: global function  

| Param | Description |
| --- | --- |
| uid | user id |
| password | UNHASHED password |

<a name="updateUserAccessToken"></a>

## updateUserAccessToken(user:)
This method modify the given user object with new access token

Note that this method take in the entire user object as parameter instead of uid

**Kind**: global function  

| Param | Description |
| --- | --- |
| user: | the user object |

<a name="createUser"></a>

## createUser(first, last, password, email) ⇒
**Kind**: global function  
**Returns**: the user object without password entry  

| Param | Description |
| --- | --- |
| first | first name of the user |
| last | last name of the user |
| password | UNHASHED password of user |
| email | email address of the user |

<a name="confirmVerification"></a>

## confirmVerification(verification_code) ⇒
**Kind**: global function  
**Returns**: User ID for sending message  

| Param | Description |
| --- | --- |
| verification_code | verification code of a given user |

<a name="addVerificationCode"></a>

## addVerificationCode(email, verification_code)
**Kind**: global function  

| Param |
| --- |
| email | 
| verification_code | 

<a name="hashedPassword"></a>

## hashedPassword(password) ⇒
Generate hashed password from unhashed password

**Kind**: global function  
**Returns**: hashed password  

| Param |
| --- |
| password | 

<a name="sanitizeEmail"></a>

## sanitizeEmail(email) ⇒
TODO: we might have to use GDPR standard in the future
It depends on the law in the US.
Since our transactions happen when the customer is physically in US,
This website might have to conform to GDPR standard if U.S. government
decides to endorse GDPR nation-wise.
If this happens, we need to santicize all email in database (hash them)

Now this method only ensures the email to be lower case.

**Kind**: global function  
**Returns**: sanitized email address  

| Param | Description |
| --- | --- |
| email | raw email address |

