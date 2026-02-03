pipeline {
  agent any

  tools {
    nodejs "node-18"
  }

  environment {
    NODE_ENV = "production"
    NEXT_TELEMETRY_DISABLED = "1"
  }

  stages {
    stage("Install project deps") {
      steps {
        sh "npm install"
      }
    }

    stage("Nextjs building artifacts") {
      steps {
        sh "npm build"
      }
    }

    stage("Unit test with jest") {
      steps {
        sh "npm test"
      }
    }
  }

  post {
    success {
      echo "Build do Next.js concluído com sucesso"
    }
    failure {
      echo "Falha no pipeline"
    }
    always {
      cleanWs()
    }
  }
}
