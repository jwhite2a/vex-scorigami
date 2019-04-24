function getData(){
    var url = "https://api.vexdb.io/v1/get_matches?sku=RE-VRC-18-5649"
    console.log('hello1');
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'json';
    request.onload = function(e) {
        var status = request.status;
        console.log('hello');
        console.log(this.response);
        console.log(request.response);
        var data = JSON.parse(request.response);
        console.log(data);
        console.log(status);
        testing();
    }
    request.send(null);

}

function testing(){
    var text = 'hello';
    console.log('text');
}