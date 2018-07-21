# Buddy Career

## Getting Started

0. install dependencies
`npm install`

1. start back-end (express) server @ localhost:3005
`npm run-script api` or `node server`

2. start front-end (React) server @ localhost:3000
`npm start`

3. (optional) build front-end to `/build` and run the entire server at one place
`npm run-script build`
`npm run-script api` or `node server`

## Modules

<dl>
<dt><a href="#module_model/College">model/College</a></dt>
<dd></dd>
<dt><a href="#module_model/Comment">model/Comment</a></dt>
<dd></dd>
<dt><a href="#module_model/Major">model/Major</a></dt>
<dd></dd>
<dt><a href="#module_model/User">model/User</a></dt>
<dd></dd>
<dt><a href="#module_router/college">router/college</a></dt>
<dd></dd>
<dt><a href="#module_router/comment">router/comment</a></dt>
<dd></dd>
<dt><a href="#module_router/major">router/major</a></dt>
<dd></dd>
<dt><a href="#module_router/user">router/user</a></dt>
<dd></dd>
<dt><a href="#module_router/user">router/user</a></dt>
<dd></dd>
</dl>

<a name="module_model/College"></a>

## model/College

* [model/College](#module_model/College)
    * [.getCollegeList(search_query)](#module_model/College.getCollegeList) ⇒ <code>Promise.&lt;Array.&lt;college&gt;&gt;</code>
    * [.addCollege(college_name)](#module_model/College.addCollege) ⇒ <code>Promise.&lt;college&gt;</code>

<a name="module_model/College.getCollegeList"></a>

### model/College.getCollegeList(search_query) ⇒ <code>Promise.&lt;Array.&lt;college&gt;&gt;</code>
Used for applying mentor

**Kind**: static method of [<code>model/College</code>](#module_model/College)  
**Returns**: <code>Promise.&lt;Array.&lt;college&gt;&gt;</code> - up to 20 college objects that matches the search query  

| Param | Type | Description |
| --- | --- | --- |
| search_query | <code>string</code> | search query |

<a name="module_model/College.addCollege"></a>

### model/College.addCollege(college_name) ⇒ <code>Promise.&lt;college&gt;</code>
add college to the college table

**Kind**: static method of [<code>model/College</code>](#module_model/College)  
**Returns**: <code>Promise.&lt;college&gt;</code> - the college object with id and name  

| Param |
| --- |
| college_name | 

<a name="module_model/Comment"></a>

## model/Comment

* [model/Comment](#module_model/Comment)
    * [.createMentorComment(mid, text, uid)](#module_model/Comment.createMentorComment)
    * [.createCommentLike(comment_id, uid)](#module_model/Comment.createCommentLike)
    * [.createMentorReply(comment_id, reply)](#module_model/Comment.createMentorReply)

<a name="module_model/Comment.createMentorComment"></a>

### model/Comment.createMentorComment(mid, text, uid)
Create comment for a given mentor

**Kind**: static method of [<code>model/Comment</code>](#module_model/Comment)  

| Param | Description |
| --- | --- |
| mid | Mentor ID |
| text | Comment text |
| uid | User ID |

<a name="module_model/Comment.createCommentLike"></a>

### model/Comment.createCommentLike(comment_id, uid)
The uid-comment_id comment ID relation is maintained by a table
to prevent one user click like multiple times

**Kind**: static method of [<code>model/Comment</code>](#module_model/Comment)  

| Param | Description |
| --- | --- |
| comment_id | Comment ID |
| uid | User ID |

<a name="module_model/Comment.createMentorReply"></a>

### model/Comment.createMentorReply(comment_id, reply)
**Kind**: static method of [<code>model/Comment</code>](#module_model/Comment)  

| Param | Description |
| --- | --- |
| comment_id | Comment ID |
| reply | Reply text |

<a name="module_model/Major"></a>

## model/Major
<a name="module_model/Major.getMajorList"></a>

### model/Major.getMajorList() ⇒ <code>Promise.&lt;Array.&lt;major&gt;&gt;</code>
**Kind**: static method of [<code>model/Major</code>](#module_model/Major)  
**Returns**: <code>Promise.&lt;Array.&lt;major&gt;&gt;</code> - A list of majors  
<a name="module_model/User"></a>

## model/User

* [model/User](#module_model/User)
    * _static_
        * [.getUserByUserID(uid)](#module_model/User.getUserByUserID) ⇒ <code>user</code>
        * [.getUserByEmailAndPassword(email, password)](#module_model/User.getUserByEmailAndPassword) ⇒ <code>user</code>
        * [.getUserIDByEmail(email)](#module_model/User.getUserIDByEmail) ⇒ <code>number</code>
        * [.getUserIDByAccessToken(access_token)](#module_model/User.getUserIDByAccessToken) ⇒ <code>number</code>
        * [.isUserAdmin(uid)](#module_model/User.isUserAdmin) ⇒ <code>boolean</code>
        * [.getUserEmail(uid)](#module_model/User.getUserEmail) ⇒ <code>string</code>
        * [.updateAttribute(uid, attr, val)](#module_model/User.updateAttribute)
        * [.updatePassword(uid, password)](#module_model/User.updatePassword)
        * [.updateAccessToken(user)](#module_model/User.updateAccessToken)
        * [.createUser(first, last, password, email)](#module_model/User.createUser) ⇒ <code>user</code>
        * [.confirmVerification(verification_code)](#module_model/User.confirmVerification) ⇒ <code>number</code>
        * [.addVerificationCodeByEmail(email, verification_code)](#module_model/User.addVerificationCodeByEmail)
        * [.addVerificationCodeByUserID(uid, verification_code)](#module_model/User.addVerificationCodeByUserID)
        * [.user](#module_model/User.user) : <code>Object</code>
    * _inner_
        * [~getUserHelper(whereClause, values)](#module_model/User..getUserHelper) ⇒ <code>user</code>
        * [~getUserInfoHelper(column, whereClause, values)](#module_model/User..getUserInfoHelper) ⇒ <code>number</code>

<a name="module_model/User.getUserByUserID"></a>

### model/User.getUserByUserID(uid) ⇒ <code>user</code>
**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>user</code> - the user object without password entry  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | User ID |

<a name="module_model/User.getUserByEmailAndPassword"></a>

### model/User.getUserByEmailAndPassword(email, password) ⇒ <code>user</code>
This method is used to verify user information on log in

**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>user</code> - the user object without password entry  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Unsanitized Email |
| password | <code>string</code> | UNHASHED password |

<a name="module_model/User.getUserIDByEmail"></a>

### model/User.getUserIDByEmail(email) ⇒ <code>number</code>
This method is used when the user forget the password

**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>number</code> - User ID  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Unsanitized Email |

<a name="module_model/User.getUserIDByAccessToken"></a>

### model/User.getUserIDByAccessToken(access_token) ⇒ <code>number</code>
This method is used to convert access token to user id

**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>number</code> - User ID  

| Param | Type | Description |
| --- | --- | --- |
| access_token | <code>string</code> | User's Access Token |

<a name="module_model/User.isUserAdmin"></a>

### model/User.isUserAdmin(uid) ⇒ <code>boolean</code>
Whether a given user is admin

**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>boolean</code> - isAdmin  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | User ID |

<a name="module_model/User.getUserEmail"></a>

### model/User.getUserEmail(uid) ⇒ <code>string</code>
Get the email address for a given user

**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>string</code> - Email Address  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | User ID |

<a name="module_model/User.updateAttribute"></a>

### model/User.updateAttribute(uid, attr, val)
This method is used to update a column for user table

**Kind**: static method of [<code>model/User</code>](#module_model/User)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | User ID |
| attr | <code>string</code> | Column in the user table |
| val | <code>\*</code> | The value you want to set to |

<a name="module_model/User.updatePassword"></a>

### model/User.updatePassword(uid, password)
**Kind**: static method of [<code>model/User</code>](#module_model/User)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>number</code> | User ID |
| password | <code>string</code> | UNHASHED password |

<a name="module_model/User.updateAccessToken"></a>

### model/User.updateAccessToken(user)
This method modify the given user object with new access token

Note that this method take in the entire user object as parameter instead of uid

**Kind**: static method of [<code>model/User</code>](#module_model/User)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>user</code> | the user object |

<a name="module_model/User.createUser"></a>

### model/User.createUser(first, last, password, email) ⇒ <code>user</code>
**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>user</code> - the user object without password entry  

| Param | Type | Description |
| --- | --- | --- |
| first | <code>string</code> | first name of the user |
| last | <code>string</code> | last name of the user |
| password | <code>string</code> | UNHASHED password of user |
| email | <code>string</code> | email address of the user |

<a name="module_model/User.confirmVerification"></a>

### model/User.confirmVerification(verification_code) ⇒ <code>number</code>
**Kind**: static method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>number</code> - User ID for sending message  

| Param | Type | Description |
| --- | --- | --- |
| verification_code | <code>string</code> | verification code of a given user |

<a name="module_model/User.addVerificationCodeByEmail"></a>

### model/User.addVerificationCodeByEmail(email, verification_code)
**Kind**: static method of [<code>model/User</code>](#module_model/User)  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Unsanitized Email |
| verification_code | <code>string</code> |  |

<a name="module_model/User.addVerificationCodeByUserID"></a>

### model/User.addVerificationCodeByUserID(uid, verification_code)
**Kind**: static method of [<code>model/User</code>](#module_model/User)  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>string</code> | User ID |
| verification_code | <code>string</code> |  |

<a name="module_model/User.user"></a>

### model/User.user : <code>Object</code>
**Kind**: static typedef of [<code>model/User</code>](#module_model/User)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | User ID |
| uid | <code>number</code> | User ID |
| first | <code>string</code> | First Name |
| last | <code>string</code> | Last Name |
| profile_pic | <code>string</code> | Profile Picture |
| register_date | <code>Date</code> | When the user is registered |
| ismentor | <code>boolean</code> | Whether the user is a mentor |
| isadmin | <code>boolean</code> | Whether the user is a system administrator |
| email | <code>string</code> | Sanitized Email Address |
| major | <code>Array.&lt;string&gt;</code> | A list of major |
| cover | <code>string</code> | Self Introduction |
| balance | <code>number</code> | Balance Available |
| wechat | <code>string</code> | WeChat Number |
| resume | <code>string</code> | Relative Path to the Resume File |
| isactivated | <code>boolean</code> | Whether the user is activated |
| access_token | <code>string</code> | Access Token |
| num_notifications | <code>number</code> | Number of Notifications |
| followee | <code>Array.&lt;number&gt;</code> | A List of User ID the User is Following |

<a name="module_model/User..getUserHelper"></a>

### model/User~getUserHelper(whereClause, values) ⇒ <code>user</code>
A helper method used to get user information by passing the constraints

**Kind**: inner method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>user</code> - the user object without password entry  

| Param | Type |
| --- | --- |
| whereClause | <code>string</code> | 
| values | <code>Array.&lt;\*&gt;</code> | 

<a name="module_model/User..getUserInfoHelper"></a>

### model/User~getUserInfoHelper(column, whereClause, values) ⇒ <code>number</code>
A helper method used to get user info by passing the constraints

**Kind**: inner method of [<code>model/User</code>](#module_model/User)  
**Returns**: <code>number</code> - User ID  

| Param | Type |
| --- | --- |
| column | <code>string</code> | 
| whereClause | <code>string</code> | 
| values | <code>Array.&lt;\*&gt;</code> | 

<a name="module_router/college"></a>

## router/college
<a name="module_router/comment"></a>

## router/comment
<a name="module_router/major"></a>

## router/major
<a name="module_router/user"></a>

## router/user
<a name="module_router/user..verificationCodeHelper"></a>

### router/user~verificationCodeHelper(hostname, email) ⇒ <code>Promise.&lt;void&gt;</code>
1. Generate the verification code
2. Add it to database
3. Send email

**Kind**: inner method of [<code>router/user</code>](#module_router/user)  

| Param |
| --- |
| hostname | 
| email | 

<a name="module_router/user"></a>

## router/user
<a name="module_router/user..verificationCodeHelper"></a>

### router/user~verificationCodeHelper(hostname, email) ⇒ <code>Promise.&lt;void&gt;</code>
1. Generate the verification code
2. Add it to database
3. Send email

**Kind**: inner method of [<code>router/user</code>](#module_router/user)  

| Param |
| --- |
| hostname | 
| email | 

