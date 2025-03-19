final String PARAMETERS_FILE = 'parameters.yml'
final String CAAS_CONFIG_FILE_ID = 'caas-subscriptions-v4'
final String REPOSITORY_DEPLOYMENT_PREFIX = 'deployment/openshift'

String version
String branchNormalizedName
String environment
String contextDir
String outputISName
String lastVersionDC
String pvcName

pipeline {
   agent {
      label 'agent-cloud-latest'
   }
   options {
      buildDiscarder(logRotator(numToKeepStr:'15'))
      timeout(time: 3, unit: 'HOURS')
      timestamps()
      ansiColor('xterm')
      durabilityHint('PERFORMANCE_OPTIMIZED')
   }

   parameters {
      choice( description: 'Selectionner environnment à déployer', name: 'environment', choices: ['recette','prod'])   
      booleanParam(name: 'promote_image', defaultValue: true, description: 'l\'image est copiee sur l\'environnement cible, ce qui peut entrainter un redemarrage et une mise à jour automatique')
      booleanParam(name: 'deploy_k8s_conf', defaultValue: true, description: 'faire le deploy apres le build')
   }   

   stages {
      /*
      * Loading and reading JSON configuration file
      */
      stage('Load files') {
         steps {
            script {
               caas_config_file_id = "${CAAS_CONFIG_FILE_ID}"
               println "caas_config_file_id : ${caas_config_file_id}"

               caas_config_filename = caas_config_file_id + '.json'
               println "caas_config_filename : ${caas_config_filename}"
               configFileProvider([configFile(fileId: caas_config_file_id, targetLocation: caas_config_filename)]) {
                  caasConfig = readJSON file: caas_config_filename
               }

               println "caasConfig : ${caasConfig}"      

               /*
               * Get current branch as image tag.
               * Using gitflow may return branches with '/' which is
               * not allowed in tag/OpenShift resources name so replacing thimagee with '-'
               */
               branchNormalizedName = env.GIT_BRANCH.replaceAll('origin/', '').replaceAll('/', '-').replaceAll('_', '-').toLowerCase() 

               println "branchNormalizedName : ${branchNormalizedName}"

               /*if (branchNormalizedName == "production") {
                  environment = "prod"
               } else if (branchNormalizedName == "recette") {
                  environment = "recette"
               } else {
                  environment = "dev"
               }*/
               environment = params.environment

               println "environment : ${environment}"

               /*
                * Set build env variables
               */
               // Read parameters.yml file
               if (! fileExists(PARAMETERS_FILE)) {
                  error("[ERROR] - Image parameters file ${PARAMETERS_FILE} not exists !")
               }

               /*
                * Get Parameters from parameters.yml file
                * Get current date formated in RFC3339
                */
               myParameters = readYaml file: PARAMETERS_FILE

               println "myParameters : ${myParameters}"
               fromImageBuild = myParameters.parameters.FROM_IMAGE.trim()
               fromImageDeploy = myParameters.parameters.deploy.FROM_IMAGE.trim()
               buildNamespace = myParameters.parameters.BUILD_NAMESPACE.trim()

               applicationName = myParameters.parameters.deploy.APPLICATION_NAME.trim()
               namespaceDeploy = myParameters.parameters.deploy.NAMESPACE_DEPLOY.trim()
               externalHost = myParameters.parameters.deploy."${environment}".EXTERNAL_HOST.trim()
               cpuRequest = myParameters.parameters.deploy."${environment}".CPU_REQUEST.trim()
               cpuLimit = myParameters.parameters.deploy."${environment}".CPU_LIMIT.trim()
               memoryRequest = myParameters.parameters.deploy."${environment}".MEMORY_REQUEST.trim()
               memoryLimit = myParameters.parameters.deploy."${environment}".MEMORY_LIMIT.trim()
               elasticsearchHost = myParameters.parameters.deploy."${environment}".ELASTICSEARCH_HOST.trim()

               imageName = myParameters.parameters.IMAGE_NAME.trim()
               contextDir = myParameters.parameters.CONTEXT_DIR.trim()
               fromNamespace = myParameters.parameters.FROM_NAMESPACE.trim()
               namespaceBuild = myParameters.parameters.BUILD_NAMESPACE.trim()
               maintainerEmail = myParameters.parameters.MAINTAINER_EMAIL.trim()
               npmMirror = myParameters.parameters.NPM_MIRROR.trim()
               sourceRegistry= myParameters.parameters.deploy.SOURCE_REGISTRY.trim()
               targetRegistry = myParameters.parameters.deploy.TARGET_REGISTRY.trim()
               
               routeTimeout = myParameters.parameters.ROUTE_TIMEOUT.trim()

               if(params.environment == "dev") {
                  pvcName = "pvc-fsm-mtb-preprodmtb1"
               }else if(params.environment == "formation") {
                  pvcName = "pvc-fsm-mtb-"
               } else if(params.environment == "prod") {
                  pvcName = "pvc-fsm-mtb-"
               }               

               // fromcreds : source - cluster hors prod 
               openshift.withCluster(caasConfig["${namespaceBuild.replaceAll("_", "-")}"]["url"]) {
                  openshift.withProject(caasConfig["${namespaceBuild.replaceAll("_", "-")}"]["namespaceName"]){
                     openshift.withCredentials(caasConfig["${namespaceBuild.replaceAll("_", "-")}"]["serviceAccountCredentialId"]){
                        fromToken = openshift.raw("whoami", "-t").out.trim()
                        fromCreds = "unused:${fromToken}"
                     }
                  }
               }
               // tocreds : destination prod
               openshift.withCluster(caasConfig["${namespaceDeploy.replaceAll("_", "-")}"]["url"]) {
                  openshift.withProject(caasConfig["${namespaceDeploy.replaceAll("_", "-")}"]["namespaceName"]){
                     openshift.withCredentials(caasConfig["${namespaceDeploy.replaceAll("_", "-")}"]["serviceAccountCredentialId"]){
                        toToken = openshift.raw("whoami", "-t").out.trim()
                        toCreds = "unused:${toToken}"
                     }
                  }
               }

               /*
               * Get current branch as image tag.
               * Using gitflow may return branches with '/' which is 
               * not allowed in tag/OpenShift resources name so replacing thimagee with '-'
               */
               version = env.GIT_BRANCH.replaceAll("origin/", "").replaceAll("/", "-").replaceAll("_", "-").toLowerCase()               

               sh(script: "git describe --exact-match --tags \$(git log -n1 --pretty='%h') > TAG", returnStdout: true, returnStatus: true)
               GIT_TAG_NAME = readFile('TAG').trim()
            }
         }
      }

      /*
      * Check parameters not empty and files correct
      */
      stage('Parameters and files analyze') {
         steps {
            script {
               if (imageName.length() == 0 || contextDir.length() == 0 || fromImageBuild.length() == 0 || fromImageDeploy.length() == 0 || namespaceBuild.length() == 0 || fromNamespace.length() == 0 || maintainerEmail.length() == 0) {
                  error("[ERROR] - Missing required parameters in ${PARAMETERS_FILES}.")
               }
               normalizedNamespaceBuild = caasConfig["${namespaceBuild.replaceAll('_', '-')}"]
               try {
                  buildCaasConfig = normalizedNamespaceBuild
               } catch (Exception e) {
                  error("[ERROR] - Entry with key ${normalizedNamespaceBuild} not found in caas-subscriptions.json")
               }

               println "buildCaasConfig : ${buildCaasConfig}"

               normalizedNamespaceDeploy = caasConfig["${namespaceDeploy.replaceAll('_', '-')}"]
               try {
                  deployCaasConfig = normalizedNamespaceDeploy
               } catch (Exception e) {
                  error("[ERROR] - Entry with key ${normalizedNamespaceDeploy} not found in caas-subscriptions.json")
               }

               println "deployCaasConfig : ${deployCaasConfig}"
            }
         }
      }

      /*
      * Check code quality (YAML lint, Dockerfile lint)
      */
      stage('Code analyze') {
         steps {
            println('[INFO] - Not implemented yet')
         }
      }

      /*
      *
      */
      stage('Build') {
         steps {
            script {
                  openshift.withCluster(buildCaasConfig['url']) {
                     openshift.withProject(buildCaasConfig['namespaceName']) {
                        openshift.withCredentials(buildCaasConfig['serviceAccountCredentialId']) {
                        imageReleaseDate = sh (script: 'date --rfc-3339=seconds', returnStdout: true).trim()

                        /*
                         * Load and process template
                         */
                        def template = readYaml file: "${REPOSITORY_DEPLOYMENT_PREFIX}/build-template.yml"
                        def processedTemplate = openshift.process(template ,
                           '-p', "IMAGE_NAME='${imageName}'",
                           '-p', "CONTEXT_DIR='${contextDir}'",
                           '-p', "GIT_URL='${env.GIT_URL}'",
                           '-p', "GIT_BRANCH='${env.GIT_BRANCH}'",
                           '-p', "IMAGE_RELEASE_DATE='${imageReleaseDate}'",
                           '-p', "IMAGE_RELEASE_NUMBER='${env.BUILD_NUMBER}'",
                           '-p', "FROM_IMAGE='${fromImageBuild}'",
                           '-p', "FROM_NAMESPACE='${fromNamespace}'",
                           '-p', "MAINTAINER_EMAIL='${maintainerEmail}'",
                           '-p', "NPM_MIRROR='${npmMirror}'",
                           '-p', "IMAGE_TAG='${branchNormalizedName}'")

                        println '[INFO] - Generated template :'
                        print processedTemplate

                        /*
                        * Get ImageStream name
                        */
                        outputISName = processedTemplate[0].spec.output.to.name.replaceAll(':.*', '')

                        /*
                        * Create ImageStream if ImageStream not exists
                        */
                        if (!openshift.selector('is', outputISName).exists()) {
                           println("[INFO] - Creating ImageStream ${outputISName}")
                           openshift.raw('create', 'is', "${outputISName}")
                        } else {
                           println("[INFO] - ImageStream ${outputISName} already exists")
                        }

                        /*
                        * Create BuildConfig, or update if BuildConfig already exist
                        */
                        if (openshift.selector('bc', "dck-${imageName}-${branchNormalizedName}").exists()) {
                           println("[INFO] - Buildconfig dck-${imageName}-${branchNormalizedName} already exists")
                           openshift.apply(processedTemplate)

                           /*
                           * Start build
                           */
                           openshift.raw('start-build', "dck-${imageName}-${branchNormalizedName}")
                        }
                        else
                        {
                           println("[INFO] - Creating dck-${imageName}-${branchNormalizedName}")
                           openshift.create(processedTemplate)
                        }

                        /*
                        * Follow build
                        * Get Last Build and check his status
                        * Start build if no build running
                        */
                        println('[INFO] - Follow build')
                        def bc = openshift.selector('bc', "dck-${imageName}-${branchNormalizedName}")

                        lastVersionBC = bc.object().status.lastVersion

                        if (lastVersionBC == 0) {
                           openshift.raw('start-build', "dck-${imageName}-${branchNormalizedName}")
                        }

                        /*
                        * Check build after running
                        */
                        def b = openshift.selector('build', "dck-${imageName}-${branchNormalizedName}-${lastVersionBC}")

                        /*
                        * Check build before running
                        */
                        timeout(10) {
                           waitUntil {
                              return b.object().status.phase == 'Running'
                           }
                        }

                        println('[INFO] - Follow build')

                        bc.logs('-f')

                        /*
                        * Check build after running
                        */
                        timeout(time:1, unit: 'HOURS') {
                           waitUntil {
                              return b.object().status.phase != 'Running'
                           }
                        }

                        lastStatus = b.object().status.phase

                        if (lastStatus != 'Complete') {
                           error('[ERROR] Build failed.')
                        }
                        }
                     }
                  }
            }
         }
      }

      /*
      * Copy Images
      */
      stage("Promote Image"){
         when { expression { return params.promote_image } }
          steps{
            script {
               wrap([$class: 'MaskPasswordsBuildWrapper', varPasswordPairs: [[password: "${fromCreds}", var: 'SECRET']]]) {
                  wrap([$class: 'MaskPasswordsBuildWrapper', varPasswordPairs: [[password: "${toCreds}", var: 'SECRET']]]) {
                     
                     if ("${fromCreds}" != "" && "${toCreds}" != "" && "${buildNamespace}" != "${namespaceDeploy}") {
                        // t is the parameter option
                        sh("echo promotion image : dck_${applicationName}:${version}")
                        sh("skopeo copy docker://${sourceRegistry}/${buildNamespace}/dck_${applicationName}:${version} docker://${targetRegistry}/${namespaceDeploy}/dck_${applicationName}:${version} --screds ${fromCreds} --dcreds ${toCreds}")
                     }
                     else {
                        //sh("skopeo copy docker://${sourceRegistry} docker://${targetRegistry}")
                        print("Error : please insert source and target registries credentials")
                     }
                  }
               }
            }
         }
      }

      /*
      *  
      */
      stage('Deploy') {
         when { expression { return params.deploy_k8s_conf } }
         steps{
            script {
               openshift.withCluster(deployCaasConfig["url"]) {
                  openshift.withProject(deployCaasConfig['namespaceName']){
                     openshift.withCredentials(deployCaasConfig['serviceAccountCredentialId']){

                        imageReleaseDate = sh (script: "date --rfc-3339=seconds", returnStdout: true).trim()

                        
                        /*
                         * Load and process template
                         */
                        def templateDc = readYaml file: "${REPOSITORY_DEPLOYMENT_PREFIX}/deployment-template.yml"
                        def templateService = readYaml file: "${REPOSITORY_DEPLOYMENT_PREFIX}/service-template.yml"
                        def templateRoute = readYaml file: "${REPOSITORY_DEPLOYMENT_PREFIX}/route-template.yml"
                        def templateCm = readYaml file: "${REPOSITORY_DEPLOYMENT_PREFIX}/configmap-template.yml"

                        def processedCmTemplate = openshift.process(templateCm,
                          "-p", "VERSION='${version}'",
                          "-p", "APPLICATION_NAME='${applicationName}'",
                           "-p", "ENV='${params.environment}'",  
                           "-p", "ELASTICSEARCH_HOST='${elasticsearchHost}'",                            
                           "-o", "yaml")

                        def processedDeployTemplate = openshift.process(templateDc,
                           "-p", "FROM_IMAGE='${fromImageDeploy}'",
                           "-p", "FROM_NAMESPACE='${namespaceDeploy}'",
                           "-p", "VERSION='${version}'",
                           "-p", "APPLICATION_NAME='${applicationName}'",
                           "-p", "PVC_NAME='${pvcName}'",
                           "-p", "ENV='${params.environment}'",
                           "-p", "CPU_REQUEST='${cpuRequest}'",
                           "-p", "CPU_LIMIT='${cpuLimit}'", 
                           "-p", "MEMORY_REQUEST='${memoryRequest}'", 
                           "-p", "MEMORY_LIMIT='${memoryLimit}'", 
                           "-o", "yaml")

                        def processedServiceTemplate = openshift.process(templateService,
                           "-p", "VERSION='${version}'",
                           "-p", "APPLICATION_NAME='${applicationName}'",
                           "-p", "ENV='${params.environment}'",                             
                           "-o", "yaml")

                        def processedRouteTemplate = openshift.process(templateRoute,
                           "-p", "EXTERNAL_HOST='${externalHost}'",
                           "-p", "VERSION='${version}'",
                           "-p", "APPLICATION_NAME='${applicationName}'",
                           "-p", "ENV='${params.environment}'",
                           "-p", "ROUTE_TIMEOUT='${routeTimeout}'",
                           "-o", "yaml")

                        println "[INFO] - Generated template ConfigMap :"
                        print processedCmTemplate

                        println "[INFO] - Generated template Deployment :"
                        print processedDeployTemplate

                        println "[INFO] - Generated template Service :"
                        print processedServiceTemplate

                        println "[INFO] - Generated template Route :"
                        print processedRouteTemplate

                        /*
                        * Create ConfigMap, or update if ConfigMap already exist
                        */
                        if (openshift.selector("configmap", "cm-${applicationName}-${params.environment}-${version}").exists()){
                           println("[INFO] - ConfigMap cm-${applicationName}-${params.environment}-${version} that already exists")
                        }
                        else
                        {
                           println("[INFO] - Creating ConfigMap cm-${applicationName}-${params.environment}-${version}")
                           openshift.apply(processedCmTemplate)
                        }

                        /*
                        * Create Service, or update if Service already exist
                        */
                        if (openshift.selector("service", "app-${applicationName}-${params.environment}-${version}").exists()){
                           println("[INFO] - Service app-${applicationName}-${params.environment}-${version} that already exists")
                        }
                        else
                        {
                           println("[INFO] - Creating Service app-${applicationName}-${params.environment}-${version}")
                           openshift.create(processedServiceTemplate, "--save-config")
                        }

                        /*
                        * Create Route, or update if Route already exist
                        */
                        if (openshift.selector("route", "app-${applicationName}-${params.environment}-${version}").exists()){
                           println("[INFO] - Route app-${applicationName}-${params.environment}-${version} that already exists")
                        }
                        else
                        {
                           println("[INFO] - Creating Route app-${applicationName}-${params.environment}-${version}")
                           openshift.create(processedRouteTemplate, "--save-config")
                        }

                        /*
                        * Create DeploymentConfig, or update if DeploymentConfig already exist
                        */
                        if (openshift.selector("deploy", "app-${applicationName}-${params.environment}-${version}").exists()){
                           println("[INFO] - Updating Deployment app-${applicationName}-${params.environment}-${version} that already exists")
                           openshift.apply(processedDeployTemplate)
                        }
                        else
                        {
                           println("[INFO] - Creating Deployment app-${applicationName}-${params.environment}-${version}")
                           openshift.create(processedDeployTemplate, "--save-config")
                        }

                        /*
                        * Follow deployment
                        * Get Last Deployment and check his status
                        * Start deployment if no deployment running
                        */
                        println("[INFO] - Check deploy")
                        def deploy = openshift.selector("deploy", "app-${applicationName}-${params.environment}-${version}")

                        lastVersionDC = deploy.object().status.latestVersion

                        timeout (5) {
                           deploy.rollout().status()
                        }
                        
                     }
                  }
               }
            }
         }
      }


   }
}
