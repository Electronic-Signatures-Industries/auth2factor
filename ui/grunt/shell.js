module.exports = function (grunt, options) {
  
    
  if (!options.deploySettings) {
    grunt.log.warn('Missing deploySettings');
    return;
  }
  if (!options.deploySettings.playbook) {
    grunt.log.warn('Missing deploySettings.playbook');
    return;
  }    
  if (!options.deploySettings.hosts) {
    grunt.log.warn('Missing deploySettings.hosts');
    return;
  }
  
  var scripts = {
    webpackDev: {
      command: 'webpack --config config/webpack.dev.js',
    },
    jasmine: {
      command: "node ./node_modules/jasmine/bin/jasmine.js"
    },    
    vagrant: {
      command: "PYTHONUNBUFFERED=1 ANSIBLE_FORCE_COLOR=true ANSIBLE_HOST_KEY_CHECKING=false ANSIBLE_SSH_ARGS='-o UserKnownHostsFile=/dev/null -o ForwardAgent=yes -o ControlMaster=auto -o ControlPersist=60s' ansible-playbook --private-key=" + options.deploySettings.ruthaDeploy + "/.vagrant/machines/default/virtualbox/private_key --user=" + options.deploySettings.hosts.vagrant.remoteUser + ' --extra-vars "target_host=' + options.deploySettings.hosts.vagrant.name + '"' + " --connection=ssh --limit='default' --inventory-file=" + options.deploySettings.ruthaDeploy + "/.vagrant/provisioners/ansible/inventory --sudo -v " + options.deploySettings.playbook,
    options: {
        execOptions: {
            maxBuffer: Infinity
        }        
    }
        
    },
    deploy: {
      command: 'PYTHONUNBUFFERED=1 ANSIBLE_FORCE_COLOR=true ansible-playbook ' + options.deploySettings.playbook + ' --private-key ' + options.deploySettings.hosts.production.sshKey + ' --sudo' + ' -u ' + options.deploySettings.hosts.production.remoteUser + ' --extra-vars "target_host=' + options.deploySettings.hosts.production.name + '"',
    options: {
        execOptions: {
            maxBuffer: Infinity
        }        
    }
        
    },
    staging: {
      command: 'PYTHONUNBUFFERED=1 ANSIBLE_FORCE_COLOR=true ansible-playbook ' + options.deploySettings.playbook + ' --private-key ' + options.deploySettings.hosts.staging.sshKey + ' --sudo' + ' -u ' + options.deploySettings.hosts.staging.remoteUser + ' --extra-vars "target_host=' + options.deploySettings.hosts.staging.name + '"',
    options: {
        execOptions: {
            maxBuffer: Infinity
        }        
    }        
    },
    postinstall: {
      command: 'node node_modules/protractor/bin/webdriver-manager update'
    }
  };
  
  if (process.env.NODE_ENV === 'production') {
    // do nothing
    scripts['postinstall'] = {
      command: 'pwd'
    };
  }
    


    
  return scripts;
};