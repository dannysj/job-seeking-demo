## Modules

<dl>
<dt><a href="#module_College">College</a></dt>
<dd></dd>
<dt><a href="#module_Comment">Comment</a></dt>
<dd></dd>
<dt><a href="#module_Mail">Mail</a></dt>
<dd></dd>
<dt><a href="#module_Major">Major</a></dt>
<dd></dd>
<dt><a href="#module_User">User</a></dt>
<dd></dd>
</dl>

<a name="module_College"></a>

## College

* [College](#module_College)
    * [.getCollegeList(search)](#module_College.getCollegeList) ⇒ <code>Promise.&lt;Array.&lt;college&gt;&gt;</code>
    * [.addCollege(college_name)](#module_College.addCollege) ⇒ <code>Promise.&lt;college&gt;</code>

<a name="module_College.getCollegeList"></a>

### College.getCollegeList(search) ⇒ <code>Promise.&lt;Array.&lt;college&gt;&gt;</code>
Used for applying mentor

**Kind**: static method of [<code>College</code>](#module_College)  
**Returns**: <code>Promise.&lt;Array.&lt;college&gt;&gt;</code> - up to 20 college objects that matches the search query  

| Param | Description |
| --- | --- |
| search | search query |

<a name="module_College.addCollege"></a>

### College.addCollege(college_name) ⇒ <code>Promise.&lt;college&gt;</code>
add college to the college table

**Kind**: static method of [<code>College</code>](#module_College)  
**Returns**: <code>Promise.&lt;college&gt;</code> - the college object with id and name  

| Param |
| --- |
| college_name | 

<a name="module_Comment"></a>

## Comment

* [Comment](#module_Comment)
    * [.createMentorComment(mid, text, uid)](#module_Comment.createMentorComment)
    * [.createCommentLike(comment_id, uid)](#module_Comment.createCommentLike)
    * [.createMentorReply(comment_id, reply)](#module_Comment.createMentorReply)

<a name="module_Comment.createMentorComment"></a>

### Comment.createMentorComment(mid, text, uid)
Create comment for a given mentor

**Kind**: static method of [<code>Comment</code>](#module_Comment)  

| Param | Description |
| --- | --- |
| mid | Mentor ID |
| text | Comment text |
| uid | User ID |

<a name="module_Comment.createCommentLike"></a>

### Comment.createCommentLike(comment_id, uid)
The uid-comment_id comment ID relation is maintained by a table
to prevent one user click like multiple times

**Kind**: static method of [<code>Comment</code>](#module_Comment)  

| Param | Description |
| --- | --- |
| comment_id | Comment ID |
| uid | User ID |

<a name="module_Comment.createMentorReply"></a>

### Comment.createMentorReply(comment_id, reply)
**Kind**: static method of [<code>Comment</code>](#module_Comment)  

| Param | Description |
| --- | --- |
| comment_id | Comment ID |
| reply | Reply text |

<a name="module_Mail"></a>

## Mail

* [Mail](#module_Mail)
    * [.sendActivationEmail(email, link)](#module_Mail.sendActivationEmail)
    * [.sendPasswordResetEmail(email, newPassword)](#module_Mail.sendPasswordResetEmail)
    * [.sendMessageEmail(email, message)](#module_Mail.sendMessageEmail)

<a name="module_Mail.sendActivationEmail"></a>

### Mail.sendActivationEmail(email, link)
**Kind**: static method of [<code>Mail</code>](#module_Mail)  

| Param | Description |
| --- | --- |
| email | receiver's email address |
| link | activation link |

<a name="module_Mail.sendPasswordResetEmail"></a>

### Mail.sendPasswordResetEmail(email, newPassword)
**Kind**: static method of [<code>Mail</code>](#module_Mail)  

| Param | Description |
| --- | --- |
| email | receiver's email address |
| newPassword | new password generated |

<a name="module_Mail.sendMessageEmail"></a>

### Mail.sendMessageEmail(email, message)
**Kind**: static method of [<code>Mail</code>](#module_Mail)  

| Param | Description |
| --- | --- |
| email | receiver's email address |
| message | in-site message |

<a name="module_Major"></a>

## Major
<a name="module_Major.getMajorList"></a>

### Major.getMajorList() ⇒ <code>Promise.&lt;Array.&lt;major&gt;&gt;</code>
**Kind**: static method of [<code>Major</code>](#module_Major)  
**Returns**: <code>Promise.&lt;Array.&lt;major&gt;&gt;</code> - A list of majors  
<a name="module_User"></a>

## User

* [User](#module_User)
    * _static_
        * [.getUserByUID(uid)](#module_User.getUserByUID) ⇒
        * [.getUserByEmailAndUnhashedPassword(email, password)](#module_User.getUserByEmailAndUnhashedPassword) ⇒
        * [.getUserIDByEmail(email)](#module_User.getUserIDByEmail) ⇒
        * [.getUserIDByAccessToken(access_token)](#module_User.getUserIDByAccessToken) ⇒
        * [.updateUserAttribute(uid, attr, val)](#module_User.updateUserAttribute)
        * [.updateUserWithUnhashedPassword(uid, password)](#module_User.updateUserWithUnhashedPassword)
        * [.updateUserAccessToken()](#module_User.updateUserAccessToken)
        * [.createUser(first, last, password, email)](#module_User.createUser)
        * [.confirmVerification(verification_code)](#module_User.confirmVerification) ⇒
        * [.addVerificationCode(email, verification_code)](#module_User.addVerificationCode)
    * _inner_
        * [~getUserHelper(whereClause, values)](#module_User..getUserHelper) ⇒
        * [~getUserIDHelper(whereClause, values)](#module_User..getUserIDHelper) ⇒
        * [~hashedPassword(password)](#module_User..hashedPassword) ⇒
        * [~sanitizeEmail(email)](#module_User..sanitizeEmail) ⇒

<a name="module_User.getUserByUID"></a>

### User.getUserByUID(uid) ⇒
**Kind**: static method of [<code>User</code>](#module_User)  
**Returns**: the user object without password entry  

| Param | Description |
| --- | --- |
| uid | User ID |

<a name="module_User.getUserByEmailAndUnhashedPassword"></a>

### User.getUserByEmailAndUnhashedPassword(email, password) ⇒
This method is used to verify user information on log in

**Kind**: static method of [<code>User</code>](#module_User)  
**Returns**: the user object without password entry  

| Param | Description |
| --- | --- |
| email |  |
| password | UNHASHED password |

<a name="module_User.getUserIDByEmail"></a>

### User.getUserIDByEmail(email) ⇒
This method is used when the user forget the password

**Kind**: static method of [<code>User</code>](#module_User)  
**Returns**: User ID  

| Param |
| --- |
| email | 

<a name="module_User.getUserIDByAccessToken"></a>

### User.getUserIDByAccessToken(access_token) ⇒
This method is used to convert access token to user id

**Kind**: static method of [<code>User</code>](#module_User)  
**Returns**: user id  

| Param |
| --- |
| access_token | 

<a name="module_User.updateUserAttribute"></a>

### User.updateUserAttribute(uid, attr, val)
This method is used to update a column for user table

**Kind**: static method of [<code>User</code>](#module_User)  

| Param | Description |
| --- | --- |
| uid | user id |
| attr | column in the user table |
| val | value you want to set |

<a name="module_User.updateUserWithUnhashedPassword"></a>

### User.updateUserWithUnhashedPassword(uid, password)
**Kind**: static method of [<code>User</code>](#module_User)  

| Param | Description |
| --- | --- |
| uid | user id |
| password | UNHASHED password |

<a name="module_User.updateUserAccessToken"></a>

### User.updateUserAccessToken()
This method modify the given user object with new access token

Note that this method take in the entire user object as parameter instead of uid

**Kind**: static method of [<code>User</code>](#module_User)  
**Param{user}**: user the user object  
<a name="module_User.createUser"></a>

### User.createUser(first, last, password, email)
**Kind**: static method of [<code>User</code>](#module_User)  
**Returns{user}**: the user object without password entry  

| Param | Description |
| --- | --- |
| first | first name of the user |
| last | last name of the user |
| password | UNHASHED password of user |
| email | email address of the user |

<a name="module_User.confirmVerification"></a>

### User.confirmVerification(verification_code) ⇒
**Kind**: static method of [<code>User</code>](#module_User)  
**Returns**: User ID for sending message  

| Param | Description |
| --- | --- |
| verification_code | verification code of a given user |

<a name="module_User.addVerificationCode"></a>

### User.addVerificationCode(email, verification_code)
**Kind**: static method of [<code>User</code>](#module_User)  

| Param |
| --- |
| email | 
| verification_code | 

<a name="module_User..getUserHelper"></a>

### User~getUserHelper(whereClause, values) ⇒
A helper method used to get user information by passing the constraints

**Kind**: inner method of [<code>User</code>](#module_User)  
**Returns**: the user object without password entry  

| Param |
| --- |
| whereClause | 
| values | 

<a name="module_User..getUserIDHelper"></a>

### User~getUserIDHelper(whereClause, values) ⇒
A helper method used to get user id by passing the constraints

**Kind**: inner method of [<code>User</code>](#module_User)  
**Returns**: user id  

| Param |
| --- |
| whereClause | 
| values | 

<a name="module_User..hashedPassword"></a>

### User~hashedPassword(password) ⇒
Generate hashed password from unhashed password

**Kind**: inner method of [<code>User</code>](#module_User)  
**Returns**: hashed password  

| Param |
| --- |
| password | 

<a name="module_User..sanitizeEmail"></a>

### User~sanitizeEmail(email) ⇒
TODO: we might have to use GDPR standard in the future
It depends on the law in the US.
Since our transactions happen when the customer is physically in US,
This website might have to conform to GDPR standard if U.S. government
decides to endorse GDPR nation-wise.
If this happens, we need to santicize all email in database (hash them)

Now this method only ensures the email to be lower case.

**Kind**: inner method of [<code>User</code>](#module_User)  
**Returns**: sanitized email address  

| Param | Description |
| --- | --- |
| email | raw email address |

