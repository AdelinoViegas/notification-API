pipeline {
  agent any

  environment {
    NODE_ENV = "production"
    NEXT_TELEMETRY_DISABLED = "1"
  }

  tools {
    nodejs "node-18"
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
      
    // stage("Checkout") {
    //     steps {
    //         checkout scm
    //     }
    // }

    // stage("Install dependencies") {
    //     steps {
    //         sh "npm install"
    //     }
    // }

    // stage("Lint") {
    //     steps {
    //         sh "npm run lint"
    //     }
    // }

    // stage("Test") {
    //     when {
    //         expression { fileExists("package.json") }
    //     }
    //     steps {
    //         sh "npm test -- --ci || true"
    //     }
    // }

    // stage("Build") {
    //     steps {
    //         sh "npm run build"
    //     }
    // }
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
