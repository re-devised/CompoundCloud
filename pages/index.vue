<template>
  <page-loader v-if="!isLoaded" />
  <div v-else>
    <span v-touch:swipe="swipeHandler">
      <portal-target name="nav" />
      <portal-target name="modal" />

      <main-nav
        :user="user"
        @search="
          (search) => {
            this.searchClient = search;
          }
        "
        @toggleSideNavBar="
          $refs.fileSideNav.changeIsMobileOpen(!$refs.fileSideNav.isMobileOpen)
        "
      />

      <div class="content">
        <file-side-nav
          @cloudChange="changeCurrentCloud"
          @sectionChange="changeCurrentSection"
          :currentCloud="currentCloud._id"
          :clouds="clouds"
          :user="user"
          :windowWidth="windowWidth"
          :diskSpace="diskSpace"
          ref="fileSideNav"
        />

        <div class="content-main">

          <list-info-textarea 
            v-if="currentSection === 1"
            :cloudId="currentCloud._id"
            :cloudDescription="currentCloud.description"
            ref="listInfoTextarea"
          />

          <top-nav>
            <top-nav-file
              v-if="currentSection === 1"
              :addFile="addFile"
              :fileCount="filteredFiles.count"
              :currentCloud="currentCloud._id"
              :clouds="clouds"
              :getColorMode="getColorMode"
              :currentCloudDescription="currentCloud.description"
              @descriptionButtonClicked="$refs.listInfoTextarea.enterEditorMode()"
              @descriptionRemoveButtonClicked="$refs.listInfoTextarea.resetCloudDescription()"
              ref="topNavFileRef"
            />
            <top-nav-cloud
              v-if="currentSection === 4 && isAdminUser"
              :cloudCount="filteredAllClouds.count"
              :users="filteredAllUsers.users"
            />
            <top-nav-user
              v-if="currentSection === 5 && isAdminUser"
              :userCount="filteredAllUsers.count"
            />
          </top-nav>

          <div
            class="file-list-container"
            @drop.prevent="addFile"
            @dragover.prevent="setOnDragover(true)"
            @dragleave.prevent="setOnDragover(false)"
            v-if="currentSection === 1"
          >
            <div class="dropzone" :class="{ 'on-dragover': onDragover }"></div>
            <file-list
              v-if="currentCloud"
              :cloud="currentCloud._id"
              :files="sortedAndFilteredFiles"
              :shortenTextNumber="shortenTextNumber"
              :changeSortingMethod="changeSortingMethod"
              :sortDirection="sortDirection"
              :pressedKeys="pressedKeys"
              ref="fileListRef"
            />
          </div>

          <cloud-list
            :clouds="sortedAndFilteredAllClouds"
            :openedClouds="clouds"
            :user="user"
            :shortenTextNumber="shortenTextNumber"
            :changeSortingMethod="changeSortingMethod"
            :sortDirection="sortDirection"
            v-if="currentSection === 4 && isAdminUser"
          />

          <user-list
            :users="sortedAndFilteredAllUsers"
            :shortenTextNumber="shortenTextNumber"
            :changeSortingMethod="changeSortingMethod"
            :sortDirection="sortDirection"
            v-if="currentSection === 5 && isAdminUser"
          />
        </div>
      </div>
    </span>
  </div>
</template>

<script>
import PageLoader from "~/components/shared/PageLoader";
import MainNav from "~/components/nav/MainNav";
import FileSideNav from "~/components/nav/FileSideNav";
import FileList from "~/components/list/FileList";
import adminIndexFunctions from "~/mixins/adminIndexFunctions";
import frontendIndexMixin from "~/mixins/frontendIndexMixin";
import backendIndexMixin from "~/mixins/backendIndexMixin";
import dataManipulationIndexMixin from "~/mixins/dataManipulationIndexMixin";
import ListInfoTextarea from '~/components/list/ListInfoTextarea'
import TopNav from "~/components/nav/TopNav";
import TopNavFile from "~/components/nav/TopNavFile";
import TopNavCloud from "~/components/nav/TopNavCloud";
import TopNavUser from "~/components/nav/TopNavUser";
import CloudList from "~/components/list/CloudList";
import UserList from "~/components/list/UserList";
import _ from "lodash";


export default {
  mixins: [
    frontendIndexMixin,
    backendIndexMixin,
    dataManipulationIndexMixin,
    adminIndexFunctions,
  ],
  components: {
    PageLoader,
    MainNav,
    FileSideNav,
    TopNav,
    TopNavFile,
    TopNavCloud,
    TopNavUser,
    FileList,
    CloudList,
    UserList,
    ListInfoTextarea,
  },
};
</script>



<style lang="scss" scoped>
* {
  // font-family: Arial, Helvetica, sans-serif;
  //font-family: 'Arial', sans-serif;
  font-family: "Inter", Arial, sans-serif;
  // font-weight: 600;
  //font-family: 'Rubrik', sans-serif;
}
html,
body {
  height: 100%;
}

.index-enter-active,
.index-leave-active {
  transition: all 0.5s ease;
}

.index-enter,
.index-leave-to {
  opacity: 0;
  transform: translateX(-2em);
}

.content {
  z-index: -2;
  padding: 20px;
  margin: 0px;
  // background-color: var(--bg-color);
  // overflow: hidden;
  display: flex;
  position: absolute;
  // min-height: calc(100vh - 56px); //minus navbar
  height: fit-content;
  width: 100%;

  &-main {
    position: relative;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    // overflow: auto;
  }

  .file-list-container {
    position: relative;
    height: 100%;
  }
  .dropzone {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .on-dragover {
    border: 3px dashed $color-grey;
  }
}
</style>
