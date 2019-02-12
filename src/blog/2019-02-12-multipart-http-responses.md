{ "title": "Multipart HTTP responses in Go" }
---

Sometimes I write HTTP servers that need to serve multiple values in response
to a single request. If the values are small, one common way is to define an
e.g. JSON object to wrap the values.

```go
type myResponse struct {
	Values []string `json:"values"`
}

func handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(myResponse{
		Values: getValues(),
	})
}
```

But sometimes that's not a great solution; for example, if the values are raw
binary data (in Go, `[]byte`) and you don't want to go through a base64
conversion. In those cases, it may make sense to use a [multipart][1] response.
For the record, this approach is adapted from the [Riak KV][2] API.

[1]: https://golang.org/pkg/mime/multipart
[2]: http://docs.basho.com/riak/kv/2.2.3/developing/usage/conflict-resolution/#siblings-in-action

Here's one way to set things up in the handler.

```go
func handle(w http.ResponseWriter, r *http.Request) {
	mediatype, _, err := mime.ParseMediaType(r.Header.Get("Accept"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotAcceptable)
		return
	}
	if mediatype != "multipart/form-data" {
		http.Error(w, "set Accept: multipart/form-data", http.StatusMultipleChoices)
		return
	}
	mw := multipart.NewWriter(w)
	w.Header().Set("Content-Type", mw.FormDataContentType())
	for _, value := range getValues() {
		fw, err := mw.CreateFormField("value")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if _, err := fw.Write(value); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	if err := mw.Close(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
```

And here's how to use it as a consumer, with error handling elided.

```go
func main() {
	req, _ := http.NewRequest("GET", "http://localhost:8080/foo", nil)
	req.Header.Set("Accept", "multipart/form-data; charset=utf-8")
	resp, _ := http.DefaultClient.Do(req)
	_, params, _ := mime.ParseMediaType(resp.Header.Get("Content-Type"))
	mr := multipart.NewReader(resp.Body, params["boundary"])
	for part, err := mr.NextPart(); err == nil; part, err = mr.NextPart() {
		value, _ := ioutil.ReadAll(part)
		log.Printf("Value: %s", value)
	}
}
```

Hopefully that helps someone. Is there a better way to do it? Tweet and me and
I'll update the code.