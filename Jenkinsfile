/* -*- mode: groovy -*- */
// dontKillMe
// jenkins will kill any process spawned during the job
// https://wiki.jenkins.io/display/JENKINS/ProcessTreeKiller
pipeline {
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '50', daysToKeepStr: '60', numToKeepStr: '50')
    disableConcurrentBuilds()
    disableResume()
    durabilityHint 'PERFORMANCE_OPTIMIZED'
    timestamps()
  }
  agent none
  stages {
    stage('multiple env') {
      parallel {
        stage('ci env') {
          when {
            anyOf {
              branch 'dev'
              branch 'jenkins-pipeline'
            }
          }
          agent {label 'bounty-backend-test-machine'}
          steps {
            script {
              sh (label: 'build', script: "yarn")
            }
            script {
              sh (label: 'stop old one', script: "yarn stop || true")
            }
            script {
              sh (label: 'start', script: "JENKINS_NODE_COOKIE=dontKillMe yarn start -- --env ci --daemon --port 7003")
            }
          }
        }

        stage('prod env') {
          when {
            allOf {
              branch 'master'
            }
          }
          agent {label 'bounty-backend-production-machine'}
          steps {
            script {
              sh (label: 'build', script: "yarn")
            }
            script {
              sh (label: 'stop old one', script: "yarn stop || true")
            }
            script {
              sh (label: 'start', script: "JENKINS_NODE_COOKIE=dontKillMe yarn start -- --env prod --daemon --port 7003")
            }
          }
        }
      }
    }
  }
  post {
    regression {
      slackSend channel: '#jenkins', color: 'danger', message: "FAILED ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", notifyCommitters: true
    }
    fixed {
      slackSend channel: '#jenkins', color: 'good', message: "SUCCESS ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)", notifyCommitters: true
    }
  }
}