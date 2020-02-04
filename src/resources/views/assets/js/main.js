
let TASKS;
let MAPPED_TASKS;

//Check if user is authenticated
checkIfUserAuthenticated((data) => {
	if(data.success)
	{
		getAllTasks()
		loadArea('todolist-area')
	}
	else
	{
		
		loadArea('login-area')
	}
})



$('#login-form').on('submit', function(e) {
	e.preventDefault();
		fetchAPI(window.location.origin+'/api/authenticate','POST', {email: $('#login-email').val(), password: $('#login-pwd').val() }, (data) => {
		if(data.success)
		{   
			localStorage.setItem('Authorization_token', data.token);
			loadArea('todolist-area')
		
		}
		else
		{
			showMessage('login-error', 'Invalid Credentials')
		}
	})
})

$('#signup-form').on('submit', function(e) {
	e.preventDefault();
	fetchAPI(window.location.origin+'/api/signup','POST', {name:$('#signup-name').val(), email: $('#signup-email').val(), password: $('#signup-pwd').val() }, (data) => {
		if(data.success)
		{
			loadArea('login-area')
		}
		else
		{   
            if('message' in data)
            {
                showMessage('signup-error', data.message)        
            }
            else
            {
    			showMessage('signup-error', 'some error occurrred')		
            }
        }
	})
})


function loadArea(areaId)
{
	$('.middle-container').addClass('d-none');
	$(`#${areaId}`).removeClass('d-none')
}


function showMessage(id, message)
{
	$(`#${id}`).html(message)
	setTimeout(() => {
		$(`#${id}`).html(``)
	},2000)
}


function checkIfUserAuthenticated(cb)
{
	fetchAPI(window.location.origin+'/api/check-auth','GET', {}, (data) => {
    	cb(data)
	})
}


function changeUserPassword()
{
	fetchAPI(window.location.origin+'/api/change-user-password','PUT', { password: $('#new-password').val()}, (data) => {
    	if(data.success)
    	{
    		showMessage('password-change-msg','Password Reset Successfully!')
    	}
    	else
    	{
    		showMessage('password-change-msg','Password could not Reset ')
    	}
	})
}

function addNewTask()
{
	fetchAPI(window.location.origin+'/api/tasks','POST', { date: $('#new-date').val(), title: $('#new-taskname').val(), status: $('#new-status').val() }, (data) => {
    	if(data.success)
    	{
    		getAllTasks()
    	}
    	else
    	{
    		console.log(data)
    	}
	})
}


function getAllTasks()
{
	fetchAPI(window.location.origin+'/api/tasks','GET', {}, (data) => {
    	if(data.success)
    	{
    		$('.todolisting').html(``)
    		TASKS = data.results
    		MAPPED_TASKS = {}
    		TASKS.forEach((el) => {
    			MAPPED_TASKS[el.id] = el
    		})
    		TASKS.forEach((el) => {
    			$('.todolisting').append(`<div class="a-single-to-do-list">
							<div class="task-name text-dark">
								${el.title}
							</div>
							<div class="task-date text-info">
								${el.date}
							</div>
							<div class="task-status ">
								<span class="badge badge-light">${el.status}</span>
							</div>
							&nbsp;
							<button class="btn btn-sm btn-info" onclick="launchEditTaskModal('${el.id}')">
								edit
							</button>&nbsp;
                            <button class="btn btn-sm btn-danger" onclick="deleteTask('${el.id}')">
                                delete
                            </button>
						</div>`)
    		})
    	}
    	else
    	{
    		console.log(data)
    	}
	})
}


function launchEditTaskModal(id)
{   

    $('#edit-taskname').val(MAPPED_TASKS[id].title)
    $('#edit-date').val(MAPPED_TASKS[id].date)
    $('#edit-status').val(MAPPED_TASKS[id].status)
    $('#submitEditedTask').attr('onclick',`saveTaskChanges(${id})`)
	$('#editTaskModal').modal('show')

}

function saveTaskChanges(id)
{
	fetchAPI(window.location.origin+'/api/tasks','PUT', { task_id:id, date: $('#edit-date').val(), title: $('#edit-taskname').val(), status: $('#edit-status').val() }, (data) => {
    	if(data.success)
    	{
    		getAllTasks()
    	}
    	else
    	{
    		console.log(data)
    	}
	})
}

function deleteTask(id)
{
    fetchAPI(window.location.origin+'/api/tasks','DELETE', { task_id:id }, (data) => {
        if(data.success)
        {
            getAllTasks()
        }
        else
        {
            console.log(data)
        }
    })
}

function logout()
{   localStorage.removeItem('Authorization_token')
	loadArea('login-area')
}

async function fetchAPI(url, method, body, cb) {


    let options = {
        method: method,
        headers: {
            'Authorization': localStorage.getItem('Authorization_token')
        }
    }
    if(method!='GET')
    {   options.headers['Content-Type'] =  'application/json'
        options.body = JSON.stringify(body)
    }

    let response = await fetch(url, options);
    if(response.status==200)
    {
        response.json().then((data) => {
        cb(data)
        }).catch((err) => {
        cb({success: false, error: err})
        })
    }
    else
    {
        cb({success: false, error: response.status })
    }

}