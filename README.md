Build [Newedenfaces](http://sahatyalkabov.com/create-a-character-voting-app-using-react-nodejs-mongodb-and-socketio/#step-18-stats-component) app using Typescript

#Run command line:
cmd1: $yarn watch
cmd2: $gulp
cmd3: $mongod --dbpath .\db\
cmd4: $mongo

```bash
$ mongo
$ use nef // sử dụng nef database
$ db.characters.find().pretty()
$ db.collection.find().limit(1).sort({$natural:-1}) // item cuối trong danh sách
$ db.characters.find({name: 'Rainbow Ray'})
```

cmd5: $tsc -w


# Bugs

1. **Resolved** watch file *.ts, *.tsx thay đổi để transpile
	- dùng câu lệnh: tsc -w
Thử convert bundle to es5 (Ko cần nữa)
Thay đổi version alt xuống đúng version như bản original thì mọi lỗi biến mất

2. **Resolved** 'request' is declared but never used trong server.ts
a. Reason: Trong tsconfig.json có flag: `"noUnusedParameters": true`
b. Solution: đổi tên request -> _request
		
3. **Resolved** Lỗi Uncaught Error: Objects are not valid as a React child (found: object with keys {message}). If you meant to render a collection of children, use an array instead or wrap the object using createFragment(object) from the React add-ons. Check the render method of `AddCharacter`.

a. Reason: I can't tell
b. Solution:
	thay dòng `this.actions.addCharacterSuccess(data);` 
	thành     `this.actions.addCharacterSuccess(data.message);`

4.  **Resolved** Lỗi tsc: error TS7030: Not all code paths return a value.
a. Reason: Trong hàm có block return, có block ko return
b. Solution:
	thay dòng `app.put('/api/characters', function(req, res, next)`
	sang	  `app.put('/api/characters', function(req, res, next): any`

5. **Resolved** search tên ra lỗi Uncaught TypeError: Cannot read property 'pushState' of undefined

```js
NavbarStore.prototype.onFindCharacterSuccess = function (payload) {
    payload.history.pushState(null, '/characters/' + payload.characterId); // history là undefined
};
```
a. Reason: history property trong Router ko push xuống childen element. Vì sử dụng react-router package phiên bản mới hơn nên một số thư viện đã thay đổi(react-router)

b. Solution:

```js
// server.ts
// đổi
ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps))
// thành
ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps))
```

```js
// App.tsx
// đổi
<Navbar history={this.props.history}/>
// thành
<Navbar history={this.props.router}/>
```

```js
// NavbarStore.ts
// đổi
payload.pushState(null, '/characters/' + payload.characterId)
// thành
payload.history.push('/characters/' + payload.characterId);
```


6. **Resolved** Property 'magnificPopup' does not exist on type 'JQuery'
a. Solution: Tạo file MagnificPopup.d.ts

7. **Resolved** Warning: [react-router] Location "/characters/819262863" did not match any routes
a. Solution: Trong routes.tsx thêm <Route path='/characters/:id' component={Character} />

8. **Resolved**Lỗi:

```powershell
$  tsc -w
node_modules/graphql-tools/dist/autopublish.d.ts(2,24): error TS2307: Cannot find module 'graphql-subscriptions'.
```

a. Solution:
Dựa theo [link này](https://github.com/apollographql/graphql-tools/issues/272), tôi cài thêm package và vấn đề biến mất.

```powershell
$ npm install --save graphql-server-express
```

# WORKED YES ✔ | NO ❌
1. ✔ Report character
2. ✔ Vote character
3. ✔ Search character
... Các chức năng khác đều hoạt động