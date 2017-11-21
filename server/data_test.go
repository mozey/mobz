package main

import (
	"github.com/stretchr/testify/assert"
	"path"
	"testing"
)

var c Config

func TestDataLoad(t *testing.T) {
	c.Load("./config.json")
	d := Data{}
	dataPath := path.Join(c.ServerDir, "test", "data.json")
	d.Load(dataPath)

	assert.Equal(t, d.Users["one"].Tag, JsonString("ee0e3a6"))
	assert.Equal(t, d.Users["one"].Username, JsonString("one"))
	assert.Equal(t, d.Users["one"].Status, JsonString("Hout Bay"))
	assert.Equal(t, d.Users["one"].Meta.Lat, JsonString("-34.035552"))
	assert.Equal(t, d.Users["one"].Meta.Lon, JsonString("18.356105"))
}
