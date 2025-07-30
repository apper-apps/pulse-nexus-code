import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ComingSoon = ({ 
  title, 
  description, 
  icon = "Clock",
  features = []
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-2xl px-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ApperIcon name={icon} size={40} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          {description}
        </p>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="glass-card rounded-xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6">Coming Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={feature.icon} size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{feature.title}</div>
                    <div className="text-sm text-slate-400">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <ApperIcon name="Bell" size={16} />
            Get Notified
          </Button>
          <Button variant="secondary" size="lg">
            <ApperIcon name="MessageSquare" size={16} />
            Request Feature
          </Button>
        </div>

        {/* Timeline */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-slate-500">
            Expected launch: <span className="text-slate-400 font-medium">Q2 2024</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;