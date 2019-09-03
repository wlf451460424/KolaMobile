#!/bin/bash -xe
bulldversion="${MAJOR_VERSION}${BUILD_NUMBER}"
#use docker to build applicaiton
imagesNames=(koala_front_h5web)

# restore and build main solution
mkdir -p ${WORKSPACE}/buildreport

# run docker image build and push to registry
for ((number=0;number < ${#imagesNames[@]};number++))
{
	echo "Image Version: ${imagesNames[number]}:${bulldversion}
    GIT COMMIT: $GIT_COMMIT
    GIT_PREVIOUS_COMMIT:$GIT_PREVIOUS_COMMIT
    GIT_PREVIOUS_SUCCESSFUL_COMMIT:$GIT_PREVIOUS_SUCCESSFUL_COMMIT
    GIT_BRANCH:$GIT_BRANCH
    GIT_LOCAL_BRANCH:$GIT_LOCAL_BRANCH
    GIT_URL:$GIT_URL
    GIT_COMMITTER_NAME:$GIT_COMMITTER_NAME
    GIT_AUTHOR_NAME:$GIT_AUTHOR_NAME
    GIT_COMMITTER_EMAIL:$GIT_COMMITTER_EMAIL
    GIT_AUTHOR_EMAIL:$GIT_AUTHOR_EMAIL
    " > ${WORKSPACE}/buildreport/buildversion.txt
	
    	echo "build static resource"
	docker run --rm \
		-v ~/.cache:/root/.cache \
		-v ~/.config:/root/.config \
		-v ~/.gnupg:/root/.gnupg \
		-v ~/.local:/root/.local \
		-v ~/.npm:/root/.npm \
		--workdir /data \
		-v ${WORKSPACE}:/data hub.mc.corp/library/node:lts-alpine /bin/sh -c "node --version && npm --version && pwd && ls -alh && npm install -g yarn && yarn install && yarn run staging-build"

	docker build -t ${imagesNames[number]}:${bulldversion} --file ${WORKSPACE}/Dockerfile ${WORKSPACE}
}

#tag new docker image for different registry and push to registry
registries=(
hub.mc.corp/koala-internal
)
docker login -u admin -p Harbor12345 hub.mc.corp
#docker login -u admin -p MC2019@har 154.209.252.232
for registry in "${registries[@]}"
do 
	for imagename in "${imagesNames[@]}"
	do 
    	echo process ${registry}/${imagename}:${bulldversion}
    	docker tag ${imagename}:${bulldversion} ${registry}/${imagename}:${bulldversion}
    	docker push ${registry}/${imagename}:${bulldversion}
    	docker rmi ${registry}/${imagename}:${bulldversion}
    done
done