import { useState, useEffect } from "react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Textarea from "@/components/atoms/Textarea";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useActivities } from "@/hooks/useActivities";
import { useContacts } from "@/hooks/useContacts";
import { cn } from "@/utils/cn";

const Activities = () => {
  const { activities, tasks, loading, error, createTask, completeTask, createActivity, loadActivities } = useActivities();
  const { contacts } = useContacts();
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [taskForm, setTaskForm] = useState({
    type: 'call',
    title: '',
    description: '',
    dueDate: '',
    contactId: '',
    priority: 'medium'
  });
  
  const [activityForm, setActivityForm] = useState({
    type: 'call',
    description: '',
    contactId: '',
    outcome: '',
    nextSteps: ''
  });
  
  const [completeForm, setCompleteForm] = useState({
    outcome: '',
    nextSteps: '',
    followUpDate: '',
    followUpType: 'call'
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(taskForm);
      setTaskForm({
        type: 'call',
        title: '',
        description: '',
        dueDate: '',
        contactId: '',
        priority: 'medium'
      });
      setShowTaskModal(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleLogActivity = async (e) => {
    e.preventDefault();
    try {
      await createActivity(activityForm);
      setActivityForm({
        type: 'call',
        description: '',
        contactId: '',
        outcome: '',
        nextSteps: ''
      });
      setShowActivityModal(false);
      toast.success('Activity logged successfully!');
    } catch (err) {
      toast.error('Failed to log activity');
    }
  };

  const handleCompleteTask = async (e) => {
    e.preventDefault();
    try {
      await completeTask(selectedTask.Id, completeForm);
      setCompleteForm({
        outcome: '',
        nextSteps: '',
        followUpDate: '',
        followUpType: 'call'
      });
      setShowCompleteModal(false);
      setSelectedTask(null);
      toast.success('Task completed successfully!');
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const openCompleteModal = (task) => {
    setSelectedTask(task);
    setShowCompleteModal(true);
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      case 'meeting': return 'Calendar';
      case 'follow-up': return 'RotateCcw';
      default: return 'MessageSquare';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const isOverdue = (dueDate) => {
    return isAfter(startOfDay(new Date()), startOfDay(new Date(dueDate)));
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter === 'all' || task.type === filter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    } else if (dateFilter === 'overdue') {
      matchesDate = isOverdue(task.dueDate);
    }
    
    return matchesSearch && matchesType && matchesDate;
  }) || [];

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter === 'all' || activity.type === filter;
    return matchesSearch && matchesType;
  }) || [];

  const getContactName = (contactId) => {
    const contact = contacts?.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Activity Management
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your tasks, log activities, and track all customer interactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowTaskModal(true)} className="glass-button">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Task
          </Button>
          <Button onClick={() => setShowActivityModal(true)} variant="outline" className="border-slate-600 hover:bg-white/5">
            <ApperIcon name="FileText" size={16} className="mr-2" />
            Log Activity
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search tasks and activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="glass-input rounded-lg px-3 py-2 text-sm bg-transparent border-slate-600 text-white"
            >
              <option value="all" className="bg-slate-800">All Types</option>
              <option value="call" className="bg-slate-800">Calls</option>
              <option value="email" className="bg-slate-800">Emails</option>
              <option value="meeting" className="bg-slate-800">Meetings</option>
              <option value="follow-up" className="bg-slate-800">Follow-ups</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="glass-input rounded-lg px-3 py-2 text-sm bg-transparent border-slate-600 text-white"
            >
              <option value="all" className="bg-slate-800">All Dates</option>
              <option value="today" className="bg-slate-800">Due Today</option>
              <option value="overdue" className="bg-slate-800">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
        {/* Upcoming Tasks - 30% */}
        <div className="xl:col-span-3">
          <div className="glass-card rounded-xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <ApperIcon name="CheckSquare" size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Upcoming Tasks</h2>
                <span className="text-sm text-slate-400">({filteredTasks.length})</span>
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.Id} className={cn(
                      "p-4 rounded-lg border transition-colors cursor-pointer hover:bg-white/5",
                      isOverdue(task.dueDate) ? "border-red-500/30 bg-red-500/5" : "border-white/10"
                    )}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ApperIcon name={getTaskIcon(task.type)} size={14} className="text-slate-400" />
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium capitalize", getPriorityColor(task.priority))}>
                            {task.priority}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => openCompleteModal(task)}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Button>
                      </div>
                      
                      <h3 className="font-medium text-white mb-1">{task.title}</h3>
                      <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{getContactName(task.contactId)}</span>
                        <span className={isOverdue(task.dueDate) ? "text-red-400" : ""}>
                          {format(new Date(task.dueDate), "MMM dd, h:mm a")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No Tasks Found</h3>
                  <p className="text-slate-500">Create a new task to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Timeline - 40% */}
        <div className="xl:col-span-4">
          <div className="glass-card rounded-xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <ApperIcon name="Activity" size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
                <span className="text-sm text-slate-400">({filteredActivities.length})</span>
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredActivities.length > 0 ? (
                <div className="space-y-4">
                  {filteredActivities.map((activity, index) => (
                    <div key={activity.Id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <ApperIcon name={getTaskIcon(activity.type)} size={14} className="text-white" />
                        </div>
                        {index < filteredActivities.length - 1 && (
                          <div className="w-px h-8 bg-slate-700 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 capitalize">
                            {activity.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            {format(new Date(activity.date), "MMM dd, h:mm a")}
                          </span>
                        </div>
                        
                        <p className="text-slate-300 text-sm mb-2">{activity.description}</p>
                        
                        {activity.outcome && (
                          <div className="mb-2">
                            <span className="text-xs text-slate-500">Outcome:</span>
                            <p className="text-xs text-slate-400">{activity.outcome}</p>
                          </div>
                        )}
                        
                        {activity.nextSteps && (
                          <div className="mb-2">
                            <span className="text-xs text-slate-500">Next Steps:</span>
                            <p className="text-xs text-slate-400">{activity.nextSteps}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500">
                          Contact: {getContactName(activity.contactId)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No Activities Found</h3>
                  <p className="text-slate-500">Your activity timeline will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - 30% */}
        <div className="xl:col-span-3">
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Open Tasks</span>
                  <span className="text-white font-medium">{tasks?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Overdue</span>
                  <span className="text-red-400 font-medium">
                    {tasks?.filter(t => isOverdue(t.dueDate)).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Completed Today</span>
                  <span className="text-green-400 font-medium">
                    {activities?.filter(a => format(new Date(a.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowTaskModal(true)}
                  className="w-full glass-button justify-start"
                >
                  <ApperIcon name="Plus" size={16} className="mr-3" />
                  Create Task
                </Button>
                <Button
                  onClick={() => setShowActivityModal(true)}
                  variant="outline"
                  className="w-full border-slate-600 hover:bg-white/5 justify-start"
                >
                  <ApperIcon name="FileText" size={16} className="mr-3" />
                  Log Activity
                </Button>
                <Button
                  onClick={() => {
                    setFilter('call');
                    setDateFilter('today');
                  }}
                  variant="outline"
                  className="w-full border-slate-600 hover:bg-white/5 justify-start"
                >
                  <ApperIcon name="Phone" size={16} className="mr-3" />
                  Today's Calls
                </Button>
                <Button
                  onClick={() => {
                    setFilter('all');
                    setDateFilter('overdue');
                  }}
                  variant="outline"
                  className="w-full border-slate-600 hover:bg-white/5 justify-start text-red-400 border-red-500/30"
                >
                  <ApperIcon name="AlertTriangle" size={16} className="mr-3" />
                  View Overdue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Task Type"
              type="select"
              value={taskForm.type}
              onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
              options={[
                { value: 'call', label: 'Call' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'follow-up', label: 'Follow-up' }
              ]}
              required
            />
            <FormField
              label="Priority"
              type="select"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
              required
            />
          </div>

          <FormField
            label="Task Title"
            type="text"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            placeholder="Enter task title..."
            required
          />

          <FormField
            label="Description"
            type="textarea"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            placeholder="Enter task description..."
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Due Date"
              type="datetime-local"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              required
            />
            <FormField
              label="Contact"
              type="select"
              value={taskForm.contactId}
              onChange={(e) => setTaskForm({ ...taskForm, contactId: e.target.value })}
              options={[
                { value: '', label: 'Select Contact...' },
                ...(contacts?.map(contact => ({
                  value: contact.Id.toString(),
                  label: `${contact.firstName} ${contact.lastName}`
                })) || [])
              ]}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 glass-button">
              Create Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTaskModal(false)}
              className="border-slate-600 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Activity Logging Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Log Activity"
      >
        <form onSubmit={handleLogActivity} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Activity Type"
              type="select"
              value={activityForm.type}
              onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
              options={[
                { value: 'call', label: 'Call' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'follow-up', label: 'Follow-up' }
              ]}
              required
            />
            <FormField
              label="Contact"
              type="select"
              value={activityForm.contactId}
              onChange={(e) => setActivityForm({ ...activityForm, contactId: e.target.value })}
              options={[
                { value: '', label: 'Select Contact...' },
                ...(contacts?.map(contact => ({
                  value: contact.Id.toString(),
                  label: `${contact.firstName} ${contact.lastName}`
                })) || [])
              ]}
              required
            />
          </div>

          <FormField
            label="Activity Description"
            type="textarea"
            value={activityForm.description}
            onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
            placeholder="Describe what happened during this activity..."
            required
          />

          <FormField
            label="Outcome"
            type="textarea"
            value={activityForm.outcome}
            onChange={(e) => setActivityForm({ ...activityForm, outcome: e.target.value })}
            placeholder="What was the result of this activity?"
          />

          <FormField
            label="Next Steps"
            type="textarea"
            value={activityForm.nextSteps}
            onChange={(e) => setActivityForm({ ...activityForm, nextSteps: e.target.value })}
            placeholder="What are the next steps to take?"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 glass-button">
              Log Activity
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowActivityModal(false)}
              className="border-slate-600 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Completion Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title={`Complete Task: ${selectedTask?.title}`}
      >
        <form onSubmit={handleCompleteTask} className="space-y-4">
          <FormField
            label="Outcome"
            type="textarea"
            value={completeForm.outcome}
            onChange={(e) => setCompleteForm({ ...completeForm, outcome: e.target.value })}
            placeholder="What was accomplished?"
            required
          />

          <FormField
            label="Next Steps"
            type="textarea"
            value={completeForm.nextSteps}
            onChange={(e) => setCompleteForm({ ...completeForm, nextSteps: e.target.value })}
            placeholder="What should be done next?"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Follow-up Date"
              type="datetime-local"
              value={completeForm.followUpDate}
              onChange={(e) => setCompleteForm({ ...completeForm, followUpDate: e.target.value })}
            />
            <FormField
              label="Follow-up Type"
              type="select"
              value={completeForm.followUpType}
              onChange={(e) => setCompleteForm({ ...completeForm, followUpType: e.target.value })}
              options={[
                { value: 'call', label: 'Call' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'follow-up', label: 'Follow-up' }
              ]}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Complete Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCompleteModal(false)}
              className="border-slate-600 hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Activities;