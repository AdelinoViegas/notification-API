pipeline {
  agent any

  tools {
    nodejs "node-22"
  }

  environment {
    NODE_ENV = "production"
    NEXT_TELEMETRY_DISABLED = "1"
  }

  stages {
    stage("Install project deps") {
      steps {
        sh "yarn install"
      }
    }

    stage("Nextjs building artifacts") {
      steps {
        sh "yarn build"
      }
    }

    stage("Unit test with jest") {
      steps {
        sh "yarn test"
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
