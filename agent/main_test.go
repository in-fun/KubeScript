package main

import (
	"testing"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/klog/v2/klogr"
)

var log = klogr.New()

func Test_settings_parseManifests(t *testing.T) {
	type fields struct {
		repoPath string
		paths    []string
	}
	tests := []struct {
		name     string
		fields   fields
		manifest []*unstructured.Unstructured
		revision string
		wantErr  bool
	}{
		{
			name: "Simple case",
			fields: fields{
				repoPath: "..",
				paths:    []string{"example/nginx"},
			},
		},
		{
			name: "Error when path is not ks dir",
			fields: fields{
				repoPath: "..",
				paths:    []string{"example"},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &settings{
				repoPath: tt.fields.repoPath,
				paths:    tt.fields.paths,
			}
			manifest, revision, err := s.parseManifests(log)
			if (err != nil) != tt.wantErr {
				t.Errorf("settings.parseManifests() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if err != nil {
				t.Logf("Got error: %v", err)
				return
			}
			if len(manifest) < 1 {
				t.Errorf("No manifest returned")
			}
			if revision == "" {
				t.Error("No non-empty revision returned")
			}
			t.Logf("Got manifest at revision %s:", revision)
		})
	}
}
