package main

import "encoding/json"

// JsonString can be used to decode any json value to string,
// otherwise `json.Unmarshal` would complain if properties
// with type string do not have string values
type JsonString string
type jsonString JsonString

func (st *JsonString) UnmarshalJSON(bArr []byte) (err error) {
	j, n, f, b := jsonString(""), uint64(0), float64(0), bool(false)
	if err = json.Unmarshal(bArr, &j); err == nil {
		*st = JsonString(j)
		return
	}
	if err = json.Unmarshal(bArr, &n); err == nil {
		*st = JsonString(string(bArr[:]))
		return
	}
	if err = json.Unmarshal(bArr, &f); err == nil {
		*st = JsonString(string(bArr[:]))
		return
	}
	if err = json.Unmarshal(bArr, &b); err == nil {
		*st = JsonString(string(bArr[:]))
		return
	}
	return
}

// JsonDump can be used to pretty print a struct representing json data
func JsonDump(i interface{}, indent bool) string {
	var indentString string
	if indent {
		indentString = "    "
	} else {
		indentString = ""
	}
	s, _ := json.MarshalIndent(i, "", indentString)
	return string(s)
}
